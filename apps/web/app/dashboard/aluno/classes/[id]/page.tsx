'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '../../../../../components/layout/Header'
import { Card } from '../../../../../components/ui/Card'
import { QuizStatusBadge } from '../../../../../components/ui/Badge'
import { EmptyState } from '../../../../../components/ui/EmptyState'
import { PageLoader } from '../../../../../components/ui/Spinner'
import { FileQuestion } from 'lucide-react'
import { classesService } from '../../../../../lib/services/classes.service'
import { quizzesService } from '../../../../../lib/services/quizzes.service'
import type { Class, Quiz } from '@repo/api'
import Link from 'next/link'

export default function AlunoClassDetailPage() {
  const params = useParams()
  const classId = params.id as string
  const [cls, setCls] = useState<Class | null>(null)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      classesService.getById(classId),
      quizzesService.getByClass(classId),
    ])
      .then(([c, q]) => {
        setCls(c)
        setQuizzes(q)
      })
      .finally(() => setLoading(false))
  }, [classId])

  if (loading || !cls) return <PageLoader />

  const publishedQuizzes = quizzes.filter((q) => q.status === 'PUBLISHED')

  return (
    <>
      <Header
        title={cls.name}
        subtitle={`${cls.subject} · ${publishedQuizzes.length} quiz${publishedQuizzes.length !== 1 ? 'zes' : ''} disponíve${publishedQuizzes.length !== 1 ? 'is' : 'l'}`}
      />
      <div className="page-padding" style={{ padding: '2rem' }}>
        {publishedQuizzes.length === 0 ? (
          <EmptyState
            icon={<FileQuestion size={48} />}
            title="Nenhum quiz disponível"
            description="Quando o professor publicar quizzes para esta turma, eles aparecerão aqui."
          />
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            {publishedQuizzes.map((quiz) => (
              <Link
                key={quiz.id}
                href={`/dashboard/aluno/quizzes/${quiz.id}`}
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
                        {quiz.title}
                      </p>
                      <p
                        style={{
                          fontSize: '0.8125rem',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {quiz.theme} · {quiz.questionCount} questões ·{' '}
                        {quiz.difficulty === 'FACIL'
                          ? 'Fácil'
                          : quiz.difficulty === 'MEDIO'
                            ? 'Médio'
                            : 'Difícil'}
                      </p>
                    </div>
                    <QuizStatusBadge status={quiz.status} />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
