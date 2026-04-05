'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '../../../../../components/layout/Header'
import { Card } from '../../../../../components/ui/Card'
import { Button } from '../../../../../components/ui/Button'
import { Badge, QuizStatusBadge } from '../../../../../components/ui/Badge'
import { PageLoader } from '../../../../../components/ui/Spinner'
import { EmptyState } from '../../../../../components/ui/EmptyState'
import { Check, Users, BarChart3 } from 'lucide-react'
import {
  quizzesService,
  type QuizWithQuestions,
} from '../../../../../lib/services/quizzes.service'
import {
  attemptsService,
  type AttemptWithDetails,
} from '../../../../../lib/services/attempts.service'
import { usersService } from '../../../../../lib/services/users.service'
import type { User } from '@repo/api'

export default function ProfessorQuizDetailPage() {
  const params = useParams()
  const quizId = params.id as string
  const [quiz, setQuiz] = useState<QuizWithQuestions | null>(null)
  const [attempts, setAttempts] = useState<AttemptWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'questions' | 'reports'>('questions')
  const [publishLoading, setPublishLoading] = useState(false)
  const [userMap, setUserMap] = useState<Record<string, User>>({})

  useEffect(() => {
    async function loadData() {
      try {
        const [q, a] = await Promise.all([
          quizzesService.getById(quizId),
          attemptsService.getByQuiz(quizId),
        ])
        setQuiz(q)
        setAttempts(a)

        // Fetch user names for each attempt
        const uniqueUserIds = [...new Set(a.map((att) => att.userId))]
        const userResults = await Promise.all(
          uniqueUserIds.map((id) => usersService.getById(id).catch(() => null)),
        )
        const uMap: Record<string, User> = {}
        userResults.forEach((u) => {
          if (u) uMap[u.id] = u
        })
        setUserMap(uMap)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [quizId])

  const handlePublish = async () => {
    setPublishLoading(true)
    try {
      const updated = await quizzesService.publish(quizId)
      setQuiz((prev) => (prev ? { ...prev, ...updated } : null))
    } finally {
      setPublishLoading(false)
    }
  }

  if (loading || !quiz) return <PageLoader />

  const avgScore =
    attempts.length > 0
      ? Math.round(
          attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length,
        )
      : 0

  const tabs = [
    { key: 'questions', label: `Questões (${quiz.questions?.length || 0})` },
    { key: 'reports', label: `Relatórios (${attempts.length})` },
  ] as const

  return (
    <>
      <Header
        title={quiz.title}
        subtitle={`${quiz.theme} · ${quiz.questionCount} questões`}
        actions={
          quiz.status !== 'PUBLISHED' ? (
            <Button onClick={handlePublish} loading={publishLoading} size="sm">
              Publicar Quiz
            </Button>
          ) : undefined
        }
      />
      <div className="page-padding" style={{ padding: '2rem' }}>
        {/* Status bar */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          <Card padding="1rem" style={{ flex: 1, minWidth: '150px' }}>
            <p
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-tertiary)',
                textTransform: 'uppercase',
                marginBottom: '0.25rem',
              }}
            >
              Status
            </p>
            <QuizStatusBadge status={quiz.status} />
          </Card>
          <Card padding="1rem" style={{ flex: 1, minWidth: '150px' }}>
            <p
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-tertiary)',
                textTransform: 'uppercase',
                marginBottom: '0.25rem',
              }}
            >
              Tentativas
            </p>
            <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {attempts.length}
            </p>
          </Card>
          <Card padding="1rem" style={{ flex: 1, minWidth: '150px' }}>
            <p
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-tertiary)',
                textTransform: 'uppercase',
                marginBottom: '0.25rem',
              }}
            >
              Média
            </p>
            <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{avgScore}%</p>
          </Card>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--color-border)',
            marginBottom: '1.5rem',
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '0.75rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: tab === t.key ? 600 : 400,
                color:
                  tab === t.key
                    ? 'var(--color-text-primary)'
                    : 'var(--color-text-secondary)',
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${tab === t.key ? 'var(--color-gray-950)' : 'transparent'}`,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'questions' && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            {quiz.questions?.map((q, i) => (
              <Card key={q.id} padding="1.25rem">
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-tertiary)',
                    fontWeight: 500,
                  }}
                >
                  Questão {i + 1}
                </span>
                <p style={{ fontWeight: 500, margin: '0.375rem 0 0.75rem' }}>
                  {q.statement}
                </p>
                {q.alternatives && q.alternatives.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.375rem',
                    }}
                  >
                    {q.alternatives.map((alt) => (
                      <div
                        key={alt.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: alt.isCorrect
                            ? '#f0fdf4'
                            : 'var(--color-gray-50)',
                          fontSize: '0.875rem',
                        }}
                      >
                        {alt.isCorrect && (
                          <Check
                            size={14}
                            style={{ color: 'var(--color-success)' }}
                          />
                        )}
                        {alt.text}
                      </div>
                    ))}
                  </div>
                )}
                {q.explanation && (
                  <p
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--color-text-tertiary)',
                      marginTop: '0.5rem',
                      fontStyle: 'italic',
                    }}
                  >
                    {q.explanation}
                  </p>
                )}
              </Card>
            ))}
            {(!quiz.questions || quiz.questions.length === 0) && (
              <EmptyState
                icon={<BarChart3 size={48} />}
                title="Nenhuma questão"
                description="Gere questões via IA para este quiz."
              />
            )}
          </div>
        )}

        {tab === 'reports' && (
          <>
            {attempts.length === 0 ? (
              <EmptyState
                icon={<Users size={48} />}
                title="Nenhuma tentativa"
                description="Quando alunos responderem o quiz, os resultados aparecerão aqui."
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr',
                    padding: '0.625rem 1rem',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--color-text-tertiary)',
                  }}
                >
                  <span>Aluno</span>
                  <span>Acertos</span>
                  <span>Nota</span>
                  <span>Status</span>
                </div>
                {attempts.map((a) => (
                  <Card key={a.id} padding="1rem">
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr 1fr',
                        alignItems: 'center',
                        fontSize: '0.875rem',
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>
                        {userMap[a.userId]?.name || a.userId}
                      </span>
                      <span>
                        {a.score}/{a.totalQuestions}
                      </span>
                      <span style={{ fontWeight: 600 }}>{a.percentage}%</span>
                      <Badge
                        variant={
                          a.status === 'COMPLETED' ? 'success' : 'warning'
                        }
                      >
                        {a.status === 'COMPLETED' ? 'Concluído' : a.status}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
