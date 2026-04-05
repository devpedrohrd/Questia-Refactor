'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '../../../../../components/layout/Header'
import { Card } from '../../../../../components/ui/Card'
import { Button } from '../../../../../components/ui/Button'
import { Input, TextArea, Select } from '../../../../../components/ui/Input'
import { Stepper } from '../../../../../components/ui/Stepper'
import { AIProcessingAnimation } from '../../../../../components/ui/Spinner'
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Check,
  X,
  Edit3,
  Plus,
  Trash2,
} from 'lucide-react'
import {
  generationContextsService,
  type CreateGenerationContextRequest,
} from '../../../../../lib/services/generation-contexts.service'
import {
  quizzesService,
  type CreateQuizRequest,
  type ConfirmQuestionItem,
} from '../../../../../lib/services/quizzes.service'
import { classesService } from '../../../../../lib/services/classes.service'
import type {
  GenerationContext,
  Class,
  CognitiveLevel,
  LanguageStyle,
  DifficultyStrategy,
  Difficulty,
  QuestionType,
} from '@repo/api'

const STEPS = ['Contexto', 'Configuração', 'Geração IA', 'Revisão']

const cognitiveLevelOptions = [
  { value: 'LEMBRAR', label: 'Lembrar' },
  { value: 'COMPREENDER', label: 'Compreender' },
  { value: 'APLICAR', label: 'Aplicar' },
  { value: 'ANALISAR', label: 'Analisar' },
  { value: 'AVALIAR', label: 'Avaliar' },
  { value: 'CRIAR', label: 'Criar' },
]

const languageStyleOptions = [
  { value: 'SIMPLES', label: 'Simples' },
  { value: 'FORMAL', label: 'Formal' },
  { value: 'TECNICO', label: 'Técnico' },
  { value: 'INFANTIL', label: 'Infantil' },
  { value: 'VESTIBULAR', label: 'Vestibular' },
  { value: 'ENEM', label: 'ENEM' },
]

const difficultyStrategyOptions = [
  { value: 'UNIFORME', label: 'Uniforme' },
  { value: 'PROGRESSIVA', label: 'Progressiva' },
  { value: 'PERSONALIZADA', label: 'Personalizada' },
]

const difficultyOptions = [
  { value: 'FACIL', label: 'Fácil' },
  { value: 'MEDIO', label: 'Médio' },
  { value: 'DIFICIL', label: 'Difícil' },
]

const questionTypeOptions = [
  { value: 'MULTIPLA_ESCOLHA', label: 'Múltipla Escolha' },
  { value: 'VERDADEIRO_FALSO', label: 'Verdadeiro/Falso' },
  { value: 'DISCURSIVA', label: 'Discursiva' },
]

export default function CreateQuizPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)

  // Step 1: Context
  const [contexts, setContexts] = useState<GenerationContext[]>([])
  const [selectedContextId, setSelectedContextId] = useState<string>('')
  const [showNewContext, setShowNewContext] = useState(false)
  const [newContext, setNewContext] = useState<CreateGenerationContextRequest>({
    name: '',
    gradeLevel: '',
    subject: '',
    topic: '',
    learningObjectives: [''],
    cognitiveLevel: 'APLICAR' as CognitiveLevel,
    languageStyle: 'FORMAL' as LanguageStyle,
    difficultyStrategy: 'PROGRESSIVA' as DifficultyStrategy,
    rules: [''],
    referenceMaterial: '',
  })

  // Step 2: Quiz config
  const [classes, setClasses] = useState<Class[]>([])
  const [quizConfig, setQuizConfig] = useState<CreateQuizRequest>({
    title: '',
    theme: '',
    difficulty: 'MEDIO' as Difficulty,
    questionType: 'MULTIPLA_ESCOLHA' as QuestionType,
    questionCount: 10,
    classId: '',
  })

  // Step 3: Generation
  const [quizId, setQuizId] = useState<string>('')
  const [generating, setGenerating] = useState(false)
  const [generationError, setGenerationError] = useState('')

  // Step 4: Preview & edit
  const [questions, setQuestions] = useState<ConfirmQuestionItem[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    generationContextsService.getMyContexts().then(setContexts)
    classesService.getMyClasses().then(setClasses)
  }, [])

  // ─── Step 1: Create or Select Context ───────────
  const handleCreateContext = async () => {
    const ctx = await generationContextsService.create({
      ...newContext,
      learningObjectives: newContext.learningObjectives.filter(Boolean),
      rules: newContext.rules.filter(Boolean),
    })
    setContexts((prev) => [...prev, ctx])
    setSelectedContextId(ctx.id)
    setShowNewContext(false)
  }

  // ─── Step 2 → 3: Create quiz then generate ───────
  const handleCreateAndGenerate = async () => {
    setGenerating(true)
    setGenerationError('')
    try {
      const quiz = await quizzesService.create({
        ...quizConfig,
        generationContextId: selectedContextId || undefined,
      })
      setQuizId(quiz.id)
      await quizzesService.generateQuestions(quiz.id, {
        generationContextId: selectedContextId || undefined,
      })
      // Poll for preview
      pollPreview(quiz.id)
    } catch {
      setGenerationError('Erro ao criar o quiz. Tente novamente.')
      setGenerating(false)
    }
  }

  const pollPreview = useCallback(async (id: string) => {
    const maxAttempts = 30
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const preview = await quizzesService.getGeneratedPreview(id)
        if (preview.status === 'AVAILABLE' && preview.questions) {
          setQuestions(preview.questions)
          setGenerating(false)
          setStep(3)
          return
        } else if (preview.status === 'FAILED') {
          setGenerationError('A geração falhou. Tente novamente.')
          setGenerating(false)
          return
        }
      } catch {
        /* continue polling */
      }
      await new Promise((r) => setTimeout(r, 2000))
    }
    setGenerationError('Tempo esgotado. Tente novamente.')
    setGenerating(false)
  }, [])

  // ─── Step 4: Confirm & Publish ───────────────────
  const handleConfirm = async () => {
    setConfirming(true)
    try {
      await quizzesService.confirmQuestions(quizId, { questions })
      setConfirming(false)
    } catch {
      setConfirming(false)
    }
  }

  const handlePublish = async () => {
    setPublishing(true)
    try {
      await handleConfirm()
      await quizzesService.publish(quizId)
      router.push(`/dashboard/professor/quizzes/${quizId}`)
    } catch {
      setPublishing(false)
    }
  }

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index))
  }

  const updateQuestion = (index: number, updated: ConfirmQuestionItem) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? updated : q)))
    setEditingIndex(null)
  }

  return (
    <>
      <Header
        title="Criar Quiz com IA"
        subtitle="Siga os passos para gerar um quiz automaticamente"
      />
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Stepper steps={STEPS} currentStep={step} />
        </div>

        {/* ═══ STEP 0: Context ═══ */}
        {step === 0 && (
          <Card>
            <h3
              style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                marginBottom: '1.25rem',
              }}
            >
              Contexto de Geração
            </h3>

            {!showNewContext ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Selecione um contexto existente ou crie um novo para guiar a
                  IA.
                </p>

                {contexts.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    {contexts.map((ctx) => (
                      <div
                        key={ctx.id}
                        onClick={() => setSelectedContextId(ctx.id)}
                        style={{
                          padding: '1rem',
                          border: `2px solid ${selectedContextId === ctx.id ? 'var(--color-gray-950)' : 'var(--color-border)'}`,
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)',
                        }}
                      >
                        <p style={{ fontWeight: 500 }}>{ctx.name}</p>
                        <p
                          style={{
                            fontSize: '0.8125rem',
                            color: 'var(--color-text-secondary)',
                          }}
                        >
                          {ctx.subject} · {ctx.topic} · {ctx.gradeLevel}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  variant="secondary"
                  icon={<Plus size={16} />}
                  onClick={() => setShowNewContext(true)}
                >
                  Criar novo contexto
                </Button>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '0.5rem',
                  }}
                >
                  <Button
                    onClick={() => setStep(1)}
                    icon={<ArrowRight size={16} />}
                    disabled={!selectedContextId && contexts.length > 0}
                  >
                    Próximo
                  </Button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                  }}
                >
                  <Input
                    label="Nome"
                    value={newContext.name}
                    onChange={(e) =>
                      setNewContext({ ...newContext, name: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Nível de ensino"
                    value={newContext.gradeLevel}
                    onChange={(e) =>
                      setNewContext({
                        ...newContext,
                        gradeLevel: e.target.value,
                      })
                    }
                    placeholder="Ex: 9º Ano"
                  />
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                  }}
                >
                  <Input
                    label="Disciplina"
                    value={newContext.subject}
                    onChange={(e) =>
                      setNewContext({ ...newContext, subject: e.target.value })
                    }
                  />
                  <Input
                    label="Tópico"
                    value={newContext.topic}
                    onChange={(e) =>
                      setNewContext({ ...newContext, topic: e.target.value })
                    }
                  />
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '1rem',
                  }}
                >
                  <Select
                    label="Nível Cognitivo"
                    value={newContext.cognitiveLevel}
                    onChange={(e) =>
                      setNewContext({
                        ...newContext,
                        cognitiveLevel: e.target.value as CognitiveLevel,
                      })
                    }
                    options={cognitiveLevelOptions}
                  />
                  <Select
                    label="Estilo de Linguagem"
                    value={newContext.languageStyle}
                    onChange={(e) =>
                      setNewContext({
                        ...newContext,
                        languageStyle: e.target.value as LanguageStyle,
                      })
                    }
                    options={languageStyleOptions}
                  />
                  <Select
                    label="Estratégia de Dificuldade"
                    value={newContext.difficultyStrategy}
                    onChange={(e) =>
                      setNewContext({
                        ...newContext,
                        difficultyStrategy: e.target
                          .value as DifficultyStrategy,
                      })
                    }
                    options={difficultyStrategyOptions}
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      marginBottom: '0.375rem',
                      display: 'block',
                    }}
                  >
                    Objetivos de aprendizagem
                  </label>
                  {newContext.learningObjectives.map((obj, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <Input
                        value={obj}
                        onChange={(e) => {
                          const updated = [...newContext.learningObjectives]
                          updated[i] = e.target.value
                          setNewContext({
                            ...newContext,
                            learningObjectives: updated,
                          })
                        }}
                        placeholder={`Objetivo ${i + 1}`}
                      />
                      {newContext.learningObjectives.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setNewContext({
                              ...newContext,
                              learningObjectives:
                                newContext.learningObjectives.filter(
                                  (_, j) => j !== i,
                                ),
                            })
                          }}
                        >
                          <X size={14} />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setNewContext({
                        ...newContext,
                        learningObjectives: [
                          ...newContext.learningObjectives,
                          '',
                        ],
                      })
                    }
                  >
                    + Adicionar objetivo
                  </Button>
                </div>

                <TextArea
                  label="Material de referência (opcional)"
                  value={newContext.referenceMaterial || ''}
                  onChange={(e) =>
                    setNewContext({
                      ...newContext,
                      referenceMaterial: e.target.value,
                    })
                  }
                  placeholder="Cole aqui textos, trechos de livros, ou instruções adicionais para a IA"
                />

                <div
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Button
                    variant="secondary"
                    onClick={() => setShowNewContext(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreateContext}
                    disabled={!newContext.name || !newContext.subject}
                  >
                    Criar e Selecionar
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* ═══ STEP 1: Quiz Config ═══ */}
        {step === 1 && (
          <Card>
            <h3
              style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                marginBottom: '1.25rem',
              }}
            >
              Configuração do Quiz
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <Input
                label="Título do quiz"
                value={quizConfig.title}
                onChange={(e) =>
                  setQuizConfig({ ...quizConfig, title: e.target.value })
                }
                placeholder="Ex: Quiz de Matemática - Equações"
                required
              />
              <Input
                label="Tema"
                value={quizConfig.theme}
                onChange={(e) =>
                  setQuizConfig({ ...quizConfig, theme: e.target.value })
                }
                placeholder="Ex: Equações do 2º Grau"
                required
              />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                }}
              >
                <Select
                  label="Dificuldade"
                  value={quizConfig.difficulty}
                  onChange={(e) =>
                    setQuizConfig({
                      ...quizConfig,
                      difficulty: e.target.value as Difficulty,
                    })
                  }
                  options={difficultyOptions}
                />
                <Select
                  label="Tipo de questão"
                  value={quizConfig.questionType}
                  onChange={(e) =>
                    setQuizConfig({
                      ...quizConfig,
                      questionType: e.target.value as QuestionType,
                    })
                  }
                  options={questionTypeOptions}
                />
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                }}
              >
                <Input
                  label="Nº de questões"
                  type="number"
                  value={String(quizConfig.questionCount)}
                  onChange={(e) =>
                    setQuizConfig({
                      ...quizConfig,
                      questionCount: Number(e.target.value),
                    })
                  }
                />
                <Select
                  label="Turma"
                  value={quizConfig.classId}
                  onChange={(e) =>
                    setQuizConfig({ ...quizConfig, classId: e.target.value })
                  }
                  options={classes.map((c) => ({ value: c.id, label: c.name }))}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '0.5rem',
                }}
              >
                <Button
                  variant="secondary"
                  icon={<ArrowLeft size={16} />}
                  onClick={() => setStep(0)}
                >
                  Voltar
                </Button>
                <Button
                  onClick={() => {
                    setStep(2)
                    handleCreateAndGenerate()
                  }}
                  icon={<Sparkles size={16} />}
                  disabled={
                    !quizConfig.title ||
                    !quizConfig.theme ||
                    !quizConfig.classId
                  }
                >
                  Gerar com IA
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* ═══ STEP 2: AI Generation ═══ */}
        {step === 2 && (
          <Card>
            {generating ? (
              <AIProcessingAnimation />
            ) : generationError ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p
                  style={{ color: 'var(--color-error)', marginBottom: '1rem' }}
                >
                  {generationError}
                </p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setStep(1)
                    setGenerating(false)
                    setGenerationError('')
                  }}
                >
                  Voltar e tentar novamente
                </Button>
              </div>
            ) : null}
          </Card>
        )}

        {/* ═══ STEP 3: Review ═══ */}
        {step === 3 && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                Revisão das Questões ({questions.length})
              </h3>
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Edite ou remova questões antes de confirmar
              </p>
            </div>

            {questions.map((q, i) => (
              <Card key={i} padding="1.25rem">
                {editingIndex === i ? (
                  <EditQuestionForm
                    question={q}
                    onSave={(updated) => updateQuestion(i, updated)}
                    onCancel={() => setEditingIndex(null)}
                  />
                ) : (
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--color-text-tertiary)',
                          fontWeight: 500,
                        }}
                      >
                        Questão {i + 1}
                      </span>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingIndex(i)}
                          icon={<Edit3 size={14} />}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(i)}
                          icon={<Trash2 size={14} />}
                        />
                      </div>
                    </div>
                    <p style={{ fontWeight: 500, marginBottom: '0.75rem' }}>
                      {q.statement}
                    </p>
                    {q.alternatives && (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.375rem',
                          paddingLeft: '0.5rem',
                        }}
                      >
                        {q.alternatives.map((alt, j) => (
                          <div
                            key={j}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.5rem 0.75rem',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: alt.isCorrect
                                ? '#f0fdf4'
                                : 'var(--color-gray-50)',
                              border: alt.isCorrect
                                ? '1px solid #bbf7d0'
                                : '1px solid transparent',
                              fontSize: '0.875rem',
                            }}
                          >
                            {alt.isCorrect && (
                              <Check
                                size={14}
                                style={{
                                  color: 'var(--color-success)',
                                  flexShrink: 0,
                                }}
                              />
                            )}
                            <span>{alt.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {q.correctAnswer && (
                      <p
                        style={{
                          fontSize: '0.8125rem',
                          color: 'var(--color-text-secondary)',
                          marginTop: '0.5rem',
                        }}
                      >
                        <strong>Resposta:</strong> {q.correctAnswer}
                      </p>
                    )}
                    {q.explanation && (
                      <p
                        style={{
                          fontSize: '0.8125rem',
                          color: 'var(--color-text-tertiary)',
                          marginTop: '0.375rem',
                          fontStyle: 'italic',
                        }}
                      >
                        {q.explanation}
                      </p>
                    )}
                  </div>
                )}
              </Card>
            ))}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '1rem',
              }}
            >
              <Button
                variant="secondary"
                onClick={() => {
                  handleConfirm()
                  router.push(`/dashboard/professor/quizzes/${quizId}`)
                }}
                loading={confirming}
              >
                Salvar como rascunho
              </Button>
              <Button
                onClick={handlePublish}
                loading={publishing}
                icon={<Sparkles size={16} />}
              >
                Confirmar e Publicar
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// ─── Inline Edit Form ─────────────────────────────
function EditQuestionForm({
  question,
  onSave,
  onCancel,
}: {
  question: ConfirmQuestionItem
  onSave: (q: ConfirmQuestionItem) => void
  onCancel: () => void
}) {
  const [q, setQ] = useState<ConfirmQuestionItem>({ ...question })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <TextArea
        label="Enunciado"
        value={q.statement}
        onChange={(e) => setQ({ ...q, statement: e.target.value })}
      />
      {q.alternatives && (
        <div>
          <label
            style={{
              fontSize: '0.8125rem',
              fontWeight: 500,
              marginBottom: '0.375rem',
              display: 'block',
            }}
          >
            Alternativas
          </label>
          {q.alternatives.map((alt, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
              }}
            >
              <input
                type="checkbox"
                checked={alt.isCorrect}
                onChange={(e) => {
                  const alts = [...q.alternatives!]
                  alts[i] = { text: alts[i]!.text, isCorrect: e.target.checked }
                  setQ({ ...q, alternatives: alts })
                }}
              />
              <Input
                value={alt.text}
                onChange={(e) => {
                  const alts = [...q.alternatives!]
                  alts[i] = {
                    text: e.target.value,
                    isCorrect: alts[i]!.isCorrect,
                  }
                  setQ({ ...q, alternatives: alts })
                }}
              />
            </div>
          ))}
        </div>
      )}
      <Input
        label="Explicação (opcional)"
        value={q.explanation || ''}
        onChange={(e) => setQ({ ...q, explanation: e.target.value })}
      />
      <div
        style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}
      >
        <Button variant="secondary" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <Button size="sm" onClick={() => onSave(q)}>
          Salvar
        </Button>
      </div>
    </div>
  )
}
