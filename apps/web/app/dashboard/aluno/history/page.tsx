'use client'

import React, { useEffect, useState } from 'react'
import { Header } from '../../../../components/layout/Header'
import { Card } from '../../../../components/ui/Card'
import { Badge } from '../../../../components/ui/Badge'
import { EmptyState } from '../../../../components/ui/EmptyState'
import { PageLoader } from '../../../../components/ui/Spinner'
import { History } from 'lucide-react'
import {
  attemptsService,
  type AttemptWithDetails,
} from '../../../../lib/services/attempts.service'
import { quizzesService } from '../../../../lib/services/quizzes.service'
import type { Quiz } from '@repo/api'
import Link from 'next/link'

export default function AlunoHistoryPage() {
  const [attempts, setAttempts] = useState<AttemptWithDetails[]>([])
  const [quizMap, setQuizMap] = useState<Record<string, Quiz>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const attemptsList = await attemptsService.getMyAttempts()
        setAttempts(attemptsList)

        // Fetch quiz details for each attempt
        const uniqueQuizIds = [...new Set(attemptsList.map((a) => a.quizId))]
        const quizResults = await Promise.all(
          uniqueQuizIds.map((id) =>
            quizzesService.getById(id).catch(() => null),
          ),
        )
        const qMap: Record<string, Quiz> = {}
        quizResults.forEach((quiz) => {
          if (quiz) qMap[quiz.id] = quiz
        })
        setQuizMap(qMap)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) return <PageLoader />

  return (
    <>
      <Header
        title="Histórico"
        subtitle={`${attempts.length} tentativa${attempts.length !== 1 ? 's' : ''}`}
      />
      <div style={{ padding: '2rem' }}>
        {attempts.length === 0 ? (
          <EmptyState
            icon={<History size={48} />}
            title="Nenhuma tentativa"
            description="Quando você responder quizzes, seu histórico aparecerá aqui."
          />
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            {attempts.map((a) => {
              const quiz = quizMap[a.quizId]
              return (
                <Link
                  key={a.id}
                  href={`/dashboard/aluno/attempts/${a.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Card hoverable padding="1.25rem">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                          {quiz?.title || '...'}
                        </p>
                        <p
                          style={{
                            fontSize: '0.8125rem',
                            color: 'var(--color-text-secondary)',
                          }}
                        >
                          {a.score}/{a.totalQuestions} acertos ·{' '}
                          {quiz?.theme || ''}
                        </p>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color:
                              a.percentage >= 70
                                ? 'var(--color-success)'
                                : a.percentage >= 40
                                  ? 'var(--color-warning)'
                                  : 'var(--color-error)',
                          }}
                        >
                          {a.percentage}%
                        </span>
                        <Badge
                          variant={
                            a.status === 'COMPLETED' ? 'success' : 'warning'
                          }
                        >
                          {a.status === 'COMPLETED' ? 'Concluído' : a.status}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
