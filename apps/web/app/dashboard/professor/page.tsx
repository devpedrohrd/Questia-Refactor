'use client'

import React, { useEffect, useState } from 'react'
import { Header } from '../../../components/layout/Header'
import { Card } from '../../../components/ui/Card'
import { PageLoader } from '../../../components/ui/Spinner'
import { BookOpen, FileQuestion, Users } from 'lucide-react'
import { classesService } from '../../../lib/services/classes.service'
import { quizzesService } from '../../../lib/services/quizzes.service'
import type { Class, Quiz } from '@repo/api'
import Link from 'next/link'
import { QuizStatusBadge } from '../../../components/ui/Badge'

export default function ProfessorDashboardPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([classesService.getMyClasses(), quizzesService.getMyQuizzes()])
      .then(([c, q]) => {
        setClasses(c)
        setQuizzes(q)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader />

  const stats = [
    {
      label: 'Turmas',
      value: classes.length,
      icon: <BookOpen size={20} />,
      color: 'var(--color-gray-950)',
    },
    {
      label: 'Quizzes',
      value: quizzes.length,
      icon: <FileQuestion size={20} />,
      color: 'var(--color-gray-600)',
    },
    {
      label: 'Publicados',
      value: quizzes.filter((q) => q.status === 'PUBLISHED').length,
      icon: <Users size={20} />,
      color: 'var(--color-gray-400)',
    },
  ]

  return (
    <>
      <Header
        title="Dashboard"
        subtitle="Visão geral da sua conta de professor"
      />
      <div className="page-padding" style={{ padding: '2rem' }}>
        {/* Stats */}
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
                <div style={{ color: s.color }}>{s.icon}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent quizzes */}
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
              Quizzes recentes
            </h3>
            <Link
              href="/dashboard/professor/quizzes"
              style={{
                fontSize: '0.8125rem',
                color: 'var(--color-text-secondary)',
                textDecoration: 'underline',
              }}
            >
              Ver todos
            </Link>
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            {quizzes.slice(0, 5).map((quiz) => (
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
                      <p style={{ fontWeight: 500, marginBottom: '0.125rem' }}>
                        {quiz.title}
                      </p>
                      <p
                        style={{
                          fontSize: '0.8125rem',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {quiz.theme}
                      </p>
                    </div>
                    <QuizStatusBadge status={quiz.status} />
                  </div>
                </Card>
              </Link>
            ))}
            {quizzes.length === 0 && (
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                  padding: '2rem',
                  textAlign: 'center',
                }}
              >
                Nenhum quiz criado ainda.
              </p>
            )}
          </div>
        </div>

        {/* Recent classes */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Turmas</h3>
            <Link
              href="/dashboard/professor/classes"
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {classes.slice(0, 4).map((cls) => (
              <Link
                key={cls.id}
                href={`/dashboard/professor/classes/${cls.id}`}
                style={{ textDecoration: 'none' }}
              >
                <Card hoverable padding="1.25rem">
                  <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                    {cls.name}
                  </p>
                  <p
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {cls.subject}
                  </p>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-text-tertiary)',
                      marginTop: '0.5rem',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    Código: {cls.code}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
