'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '../../../../../components/layout/Header'
import { Card } from '../../../../../components/ui/Card'
import { Button } from '../../../../../components/ui/Button'
import { PageLoader } from '../../../../../components/ui/Spinner'
import { ArrowRight, ArrowLeft, Send, CheckCircle } from 'lucide-react'
import {
  quizzesService,
  type QuizWithQuestions,
} from '../../../../../lib/services/quizzes.service'
import {
  attemptsService,
  type AnswerItem,
} from '../../../../../lib/services/attempts.service'

export default function AlunoQuizTakingPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.id as string
  const [quiz, setQuiz] = useState<QuizWithQuestions | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Map<string, AnswerItem>>(new Map())
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    quizzesService
      .getById(quizId)
      .then(setQuiz)
      .finally(() => setLoading(false))
  }, [quizId])

  if (loading || !quiz) return <PageLoader />

  const questions = quiz.questions || []
  const currentQuestion = questions[currentIndex]
  const totalAnswered = answers.size
  const progress =
    questions.length > 0 ? (totalAnswered / questions.length) * 100 : 0

  const selectAnswer = (
    questionId: string,
    alternativeId?: string,
    response?: string,
  ) => {
    setAnswers((prev) => {
      const map = new Map(prev)
      map.set(questionId, { questionId, alternativeId, response })
      return map
    })
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      const attempt = await attemptsService.submit({
        quizId,
        answers: Array.from(answers.values()),
      })
      router.push(`/dashboard/aluno/attempts/${attempt.id}`)
    } catch {
      setError(
        'Erro ao enviar respostas. Você já pode ter respondido este quiz.',
      )
      setSubmitting(false)
    }
  }

  if (!currentQuestion) return <PageLoader />

  const currentAnswer = answers.get(currentQuestion.id)

  return (
    <>
      <Header
        title={quiz.title}
        subtitle={`Questão ${currentIndex + 1} de ${questions.length}`}
      />

      {/* Progress bar */}
      <div style={{ height: '3px', backgroundColor: 'var(--color-gray-100)' }}>
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: 'var(--color-gray-950)',
            transition: 'width var(--transition-base)',
          }}
        />
      </div>

      <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
        <Card padding="2rem" style={{ animation: 'fadeIn 200ms ease-out' }}>
          {/* Question statement */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-tertiary)',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Questão {currentIndex + 1}
            </span>
            <p
              style={{
                fontSize: '1.0625rem',
                fontWeight: 500,
                marginTop: '0.5rem',
                lineHeight: 1.6,
              }}
            >
              {currentQuestion.statement}
            </p>
          </div>

          {/* Alternatives */}
          {currentQuestion.alternatives &&
            currentQuestion.alternatives.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                {currentQuestion.alternatives.map((alt) => {
                  const isSelected = currentAnswer?.alternativeId === alt.id
                  return (
                    <button
                      key={alt.id}
                      onClick={() => selectAnswer(currentQuestion.id, alt.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.875rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: `2px solid ${isSelected ? 'var(--color-gray-950)' : 'var(--color-border)'}`,
                        backgroundColor: isSelected
                          ? 'var(--color-gray-50)'
                          : 'var(--color-white)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '0.875rem',
                        transition: 'all var(--transition-fast)',
                        fontFamily: 'inherit',
                        width: '100%',
                      }}
                    >
                      <div
                        style={{
                          width: '1.25rem',
                          height: '1.25rem',
                          borderRadius: '50%',
                          border: `2px solid ${isSelected ? 'var(--color-gray-950)' : 'var(--color-gray-300)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'all var(--transition-fast)',
                        }}
                      >
                        {isSelected && (
                          <div
                            style={{
                              width: '0.5rem',
                              height: '0.5rem',
                              borderRadius: '50%',
                              backgroundColor: 'var(--color-gray-950)',
                            }}
                          />
                        )}
                      </div>
                      <span>{alt.text}</span>
                    </button>
                  )
                })}
              </div>
            )}

          {/* Discursive */}
          {currentQuestion.type === 'DISCURSIVA' && (
            <textarea
              value={currentAnswer?.response || ''}
              onChange={(e) =>
                selectAnswer(currentQuestion.id, undefined, e.target.value)
              }
              placeholder="Digite sua resposta..."
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '0.75rem',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none',
              }}
            />
          )}

          {error && (
            <p
              style={{
                fontSize: '0.8125rem',
                color: 'var(--color-error)',
                marginTop: '1rem',
                textAlign: 'center',
              }}
            >
              {error}
            </p>
          )}
        </Card>

        {/* Navigation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1.5rem',
          }}
        >
          <Button
            variant="secondary"
            icon={<ArrowLeft size={16} />}
            onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
            disabled={currentIndex === 0}
          >
            Anterior
          </Button>

          <span
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            {totalAnswered}/{questions.length} respondidas
          </span>

          {currentIndex < questions.length - 1 ? (
            <Button
              icon={<ArrowRight size={16} />}
              onClick={() =>
                setCurrentIndex((p) => Math.min(questions.length - 1, p + 1))
              }
            >
              Próxima
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              loading={submitting}
              icon={<Send size={16} />}
              disabled={totalAnswered < questions.length}
            >
              Enviar Respostas
            </Button>
          )}
        </div>

        {/* Question dots */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.375rem',
            marginTop: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              style={{
                width: '1.75rem',
                height: '1.75rem',
                borderRadius: 'var(--radius-sm)',
                border:
                  i === currentIndex
                    ? '2px solid var(--color-gray-950)'
                    : '1px solid var(--color-border)',
                backgroundColor: answers.has(q.id)
                  ? 'var(--color-gray-950)'
                  : 'var(--color-white)',
                color: answers.has(q.id)
                  ? 'var(--color-white)'
                  : 'var(--color-text-secondary)',
                fontSize: '0.6875rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                fontFamily: 'inherit',
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
