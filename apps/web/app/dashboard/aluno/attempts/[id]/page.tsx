'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '../../../../../components/layout/Header'
import { Card } from '../../../../../components/ui/Card'
import { Badge } from '../../../../../components/ui/Badge'
import { PageLoader } from '../../../../../components/ui/Spinner'
import { Check, X, Trophy } from 'lucide-react'
import {
  attemptsService,
  type AttemptWithDetails,
} from '../../../../../lib/services/attempts.service'

export default function AlunoAttemptFeedbackPage() {
  const params = useParams()
  const attemptId = params.id as string
  const [attempt, setAttempt] = useState<AttemptWithDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    attemptsService
      .getById(attemptId)
      .then(setAttempt)
      .finally(() => setLoading(false))
  }, [attemptId])

  if (loading || !attempt) return <PageLoader />

  const scoreColor =
    attempt.percentage >= 70
      ? 'var(--color-success)'
      : attempt.percentage >= 40
        ? 'var(--color-warning)'
        : 'var(--color-error)'

  return (
    <>
      <Header
        title="Resultado do Quiz"
        subtitle={attempt.quiz?.title || 'Quiz'}
      />
      <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
        {/* Score card */}
        <Card
          padding="2rem"
          style={{ textAlign: 'center', marginBottom: '2rem' }}
        >
          <Trophy
            size={40}
            style={{ color: scoreColor, margin: '0 auto 1rem' }}
          />
          <p
            style={{
              fontSize: '3rem',
              fontWeight: 800,
              color: scoreColor,
              lineHeight: 1,
            }}
          >
            {attempt.percentage}%
          </p>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--color-text-secondary)',
              marginTop: '0.5rem',
            }}
          >
            {attempt.score} de {attempt.totalQuestions} questões corretas
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '1rem',
            }}
          >
            <Badge
              variant={
                attempt.percentage >= 70
                  ? 'success'
                  : attempt.percentage >= 40
                    ? 'warning'
                    : 'error'
              }
            >
              {attempt.percentage >= 70
                ? 'Aprovado'
                : attempt.percentage >= 40
                  ? 'Regular'
                  : 'Reprovado'}
            </Badge>
            <Badge variant="outline">
              {attempt.status === 'COMPLETED' ? 'Concluído' : attempt.status}
            </Badge>
          </div>
        </Card>

        {/* Answers */}
        {attempt.answers && attempt.answers.length > 0 && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <h3
              style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                marginBottom: '0.25rem',
              }}
            >
              Gabarito
            </h3>
            {attempt.answers.map((ans: any, i: number) => (
              <Card key={ans.id} padding="1.25rem">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      borderRadius: '50%',
                      backgroundColor: ans.isCorrect ? '#dcfce7' : '#fee2e2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '0.125rem',
                    }}
                  >
                    {ans.isCorrect ? (
                      <Check
                        size={12}
                        style={{ color: 'var(--color-success)' }}
                      />
                    ) : (
                      <X size={12} style={{ color: 'var(--color-error)' }} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-tertiary)',
                      }}
                    >
                      Questão {i + 1}
                    </span>
                    <p style={{ fontWeight: 500, marginTop: '0.125rem' }}>
                      {ans.question?.statement || ''}
                    </p>
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--color-text-secondary)',
                        marginTop: '0.5rem',
                      }}
                    >
                      <strong>Sua resposta:</strong> {ans.response}
                    </p>
                    {ans.question?.correctAnswer && (
                      <p
                        style={{
                          fontSize: '0.8125rem',
                          color: 'var(--color-success)',
                          marginTop: '0.25rem',
                        }}
                      >
                        <strong>Resposta correta:</strong>{' '}
                        {ans.question.correctAnswer}
                      </p>
                    )}
                    {ans.question?.explanation && (
                      <p
                        style={{
                          fontSize: '0.8125rem',
                          color: 'var(--color-text-tertiary)',
                          marginTop: '0.375rem',
                          fontStyle: 'italic',
                        }}
                      >
                        {ans.question.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
