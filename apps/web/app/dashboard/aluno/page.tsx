'use client'

import React, { useEffect, useState } from 'react'
import { Header } from '../../../components/layout/Header'
import { Card } from '../../../components/ui/Card'
import { PageLoader } from '../../../components/ui/Spinner'
import { GraduationCap, FileQuestion, Trophy } from 'lucide-react'
import { enrollmentsService } from '../../../lib/services/enrollments.service'
import {
  attemptsService,
  type AttemptWithDetails,
} from '../../../lib/services/attempts.service'
import { classesService } from '../../../lib/services/classes.service'
import { quizzesService } from '../../../lib/services/quizzes.service'
import type { Enrollment, Class, Quiz } from '@repo/api'
import Link from 'next/link'

export default function AlunoDashboardPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [attempts, setAttempts] = useState<AttemptWithDetails[]>([])
  const [classMap, setClassMap] = useState<Record<string, Class>>({})
  const [quizMap, setQuizMap] = useState<Record<string, Quiz>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [enrollmentsList, attemptsList] = await Promise.all([
          enrollmentsService.getMyEnrollments(),
          attemptsService.getMyAttempts(),
        ])
        setEnrollments(enrollmentsList)
        setAttempts(attemptsList)

        // Fetch class details for each enrollment
        const uniqueClassIds = [
          ...new Set(enrollmentsList.map((e) => e.classId)),
        ]
        const classResults = await Promise.all(
          uniqueClassIds.map((id) =>
            classesService.getById(id).catch(() => null),
          ),
        )
        const cMap: Record<string, Class> = {}
        classResults.forEach((cls) => {
          if (cls) cMap[cls.id] = cls
        })
        setClassMap(cMap)

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

  const avgScore =
    attempts.length > 0
      ? Math.round(
          attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length,
        )
      : 0

  const stats = [
    {
      label: 'Turmas',
      value: enrollments.length,
      icon: <GraduationCap size={20} />,
    },
    {
      label: 'Quizzes feitos',
      value: attempts.length,
      icon: <FileQuestion size={20} />,
    },
    { label: 'Média geral', value: `${avgScore}%`, icon: <Trophy size={20} /> },
  ]

  return (
    <>
      <Header title="Dashboard" subtitle="Visão geral da sua conta de aluno" />
      <div className="page-padding" style={{ padding: '2rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          {stats.map((s) => (
            <Card key={s.label} padding="1.25rem">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'var(--color-text-tertiary)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {s.label}
                  </p>
                  <p style={{ fontSize: '1.75rem', fontWeight: 700 }}>
                    {s.value}
                  </p>
                </div>
                <div style={{ color: 'var(--color-gray-500)' }}>{s.icon}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Enrolled classes */}
        <div style={{ marginBottom: '2rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
              Minhas Turmas
            </h3>
            <Link
              href="/dashboard/aluno/classes"
              style={{
                fontSize: '0.8125rem',
                color: 'var(--color-text-secondary)',
                textDecoration: 'underline',
              }}
            >
              Ver todas
            </Link>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {enrollments.slice(0, 4).map((e) => {
              const cls = classMap[e.classId]
              return (
                <Link
                  key={e.id}
                  href={`/dashboard/aluno/classes/${e.classId}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Card hoverable padding="1.25rem">
                    <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                      {cls?.name || '...'}
                    </p>
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {cls?.subject || ''}
                    </p>
                  </Card>
                </Link>
              )
            })}
          </div>
          {enrollments.length === 0 && (
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-secondary)',
                padding: '2rem',
                textAlign: 'center',
              }}
            >
              Você ainda não está matriculado em nenhuma turma.
            </p>
          )}
        </div>

        {/* Recent attempts */}
        {attempts.length > 0 && (
          <div>
            <h3
              style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                marginBottom: '1rem',
              }}
            >
              Últimas tentativas
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              {attempts.slice(0, 5).map((a) => {
                const quiz = quizMap[a.quizId]
                return (
                  <Link
                    key={a.id}
                    href={`/dashboard/aluno/attempts/${a.id}`}
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
                          <p style={{ fontWeight: 500 }}>
                            {quiz?.title || '...'}
                          </p>
                          <p
                            style={{
                              fontSize: '0.8125rem',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            {a.score}/{a.totalQuestions} acertos
                          </p>
                        </div>
                        <span
                          style={{
                            fontSize: '1.25rem',
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
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
