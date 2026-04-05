'use client'

import React, { useEffect, useState } from 'react'
import { Header } from '../../../../components/layout/Header'
import { Card } from '../../../../components/ui/Card'
import { Button } from '../../../../components/ui/Button'
import { QuizStatusBadge } from '../../../../components/ui/Badge'
import { EmptyState } from '../../../../components/ui/EmptyState'
import { PageLoader } from '../../../../components/ui/Spinner'
import { FileQuestion, Plus, Trash2 } from 'lucide-react'
import { quizzesService } from '../../../../lib/services/quizzes.service'
import type { Quiz } from '@repo/api'
import Link from 'next/link'

export default function ProfessorQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    quizzesService
      .getMyQuizzes()
      .then(setQuizzes)
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este quiz?')) return
    await quizzesService.delete(id)
    setQuizzes((prev) => prev.filter((q) => q.id !== id))
  }

  if (loading) return <PageLoader />

  return (
    <>
      <Header
        title="Meus Quizzes"
        subtitle={`${quizzes.length} quiz${quizzes.length !== 1 ? 'zes' : ''}`}
        actions={
          <Link href="/dashboard/professor/quizzes/create">
            <Button icon={<Plus size={16} />} size="sm">
              Criar Quiz
            </Button>
          </Link>
        }
      />
      <div style={{ padding: '2rem' }}>
        {quizzes.length === 0 ? (
          <EmptyState
            icon={<FileQuestion size={48} />}
            title="Nenhum quiz criado"
            description="Crie seu primeiro quiz com IA para seus alunos."
            action={{
              label: 'Criar Quiz',
              onClick: () =>
                (window.location.href = '/dashboard/professor/quizzes/create'),
            }}
          />
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            {quizzes.map((quiz) => (
              <Card key={quiz.id} padding="1.25rem" hoverable>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Link
                    href={`/dashboard/professor/quizzes/${quiz.id}`}
                    style={{ flex: 1, textDecoration: 'none' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '0.25rem',
                          }}
                        >
                          <p style={{ fontWeight: 600 }}>{quiz.title}</p>
                          <QuizStatusBadge status={quiz.status} />
                        </div>
                        <p
                          style={{
                            fontSize: '0.8125rem',
                            color: 'var(--color-text-secondary)',
                          }}
                        >
                          {quiz.theme} · {quiz.questionCount} questões ·{' '}
                          {quiz.difficulty}
                        </p>
                      </div>
                    </div>
                  </Link>
                  {quiz.status !== 'PUBLISHED' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(quiz.id)}
                      icon={<Trash2 size={14} />}
                    />
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
