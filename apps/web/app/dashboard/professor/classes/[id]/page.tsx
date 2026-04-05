'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '../../../../../components/layout/Header'
import { Card } from '../../../../../components/ui/Card'
import { Badge, QuizStatusBadge } from '../../../../../components/ui/Badge'
import { PageLoader } from '../../../../../components/ui/Spinner'
import { EmptyState } from '../../../../../components/ui/EmptyState'
import { User as UserIcon, FileQuestion } from 'lucide-react'
import { classesService } from '../../../../../lib/services/classes.service'
import {
  enrollmentsService,
  type EnrollmentWithClass,
} from '../../../../../lib/services/enrollments.service'
import { quizzesService } from '../../../../../lib/services/quizzes.service'
import { usersService } from '../../../../../lib/services/users.service'
import type { Class, Quiz, User } from '@repo/api'
import Link from 'next/link'

export default function ProfessorClassDetailPage() {
  const params = useParams()
  const classId = params.id as string
  const [cls, setCls] = useState<Class | null>(null)
  const [enrollments, setEnrollments] = useState<EnrollmentWithClass[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'students' | 'quizzes'>('students')
  const [userMap, setUserMap] = useState<Record<string, User>>({})

  useEffect(() => {
    async function loadData() {
      try {
        const [c, e, q] = await Promise.all([
          classesService.getById(classId),
          enrollmentsService.getByClass(classId),
          quizzesService.getByClass(classId),
        ])
        setCls(c)
        setEnrollments(e)
        setQuizzes(q)

        // Fetch user names for each enrollment
        const uniqueUserIds = [...new Set(e.map((enr) => enr.userId))]
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
  }, [classId])

  if (loading || !cls) return <PageLoader />

  const tabs = [
    { key: 'students', label: `Alunos (${enrollments.length})` },
    { key: 'quizzes', label: `Quizzes (${quizzes.length})` },
  ] as const

  return (
    <>
      <Header
        title={cls.name}
        subtitle={`${cls.subject} · Código: ${cls.code}`}
      />
      <div style={{ padding: '2rem' }}>
        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0',
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
                borderBottom:
                  tab === t.key
                    ? '2px solid var(--color-gray-950)'
                    : '2px solid transparent',
                background: 'none',
                border: 'none',
                borderBottomWidth: '2px',
                borderBottomStyle: 'solid',
                borderBottomColor:
                  tab === t.key ? 'var(--color-gray-950)' : 'transparent',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                fontFamily: 'inherit',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'students' && (
          <>
            {enrollments.length === 0 ? (
              <EmptyState
                icon={<UserIcon size={48} />}
                title="Nenhum aluno matriculado"
                description="Compartilhe o código da turma com seus alunos para que eles possam se matricular."
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                {enrollments.map((e) => (
                  <Card key={e.id} padding="1rem">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                        }}
                      >
                        <div
                          style={{
                            width: '2rem',
                            height: '2rem',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-gray-100)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <UserIcon
                            size={14}
                            style={{ color: 'var(--color-text-tertiary)' }}
                          />
                        </div>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                          {userMap[e.userId]?.name || e.userId}
                        </span>
                      </div>
                      <Badge variant="outline">{e.role}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'quizzes' && (
          <>
            {quizzes.length === 0 ? (
              <EmptyState
                icon={<FileQuestion size={48} />}
                title="Nenhum quiz nesta turma"
                description="Crie um quiz e vincule a esta turma."
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                {quizzes.map((quiz) => (
                  <Link
                    key={quiz.id}
                    href={`/dashboard/professor/quizzes/${quiz.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <Card hoverable padding="1rem">
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <p style={{ fontWeight: 500 }}>{quiz.title}</p>
                          <p
                            style={{
                              fontSize: '0.8125rem',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            {quiz.theme} · {quiz.questionCount} questões
                          </p>
                        </div>
                        <QuizStatusBadge status={quiz.status} />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
