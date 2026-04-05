'use client'

import React, { useEffect, useState } from 'react'
import { Header } from '../../../../components/layout/Header'
import { Card } from '../../../../components/ui/Card'
import { Button } from '../../../../components/ui/Button'
import { Modal } from '../../../../components/ui/Modal'
import { Input, TextArea, Select } from '../../../../components/ui/Input'
import { EmptyState } from '../../../../components/ui/EmptyState'
import { PageLoader } from '../../../../components/ui/Spinner'
import { Brain, Plus, Trash2 } from 'lucide-react'
import {
  generationContextsService,
  type CreateGenerationContextRequest,
} from '../../../../lib/services/generation-contexts.service'
import type {
  GenerationContext,
  CognitiveLevel,
  LanguageStyle,
  DifficultyStrategy,
} from '@repo/api'

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

export default function ProfessorContextsPage() {
  const [contexts, setContexts] = useState<GenerationContext[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<CreateGenerationContextRequest>({
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

  useEffect(() => {
    generationContextsService
      .getMyContexts()
      .then(setContexts)
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async () => {
    setCreating(true)
    try {
      const ctx = await generationContextsService.create({
        ...form,
        learningObjectives: form.learningObjectives.filter(Boolean),
        rules: form.rules.filter(Boolean),
      })
      setContexts((prev) => [...prev, ctx])
      setModalOpen(false)
      setForm({
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
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este contexto de geração?')) return
    await generationContextsService.delete(id)
    setContexts((prev) => prev.filter((c) => c.id !== id))
  }

  if (loading) return <PageLoader />

  return (
    <>
      <Header
        title="Contextos de Geração IA"
        subtitle="Configure contextos para guiar a IA na criação de questões"
        actions={
          <Button
            icon={<Plus size={16} />}
            size="sm"
            onClick={() => setModalOpen(true)}
          >
            Novo Contexto
          </Button>
        }
      />
      <div style={{ padding: '2rem' }}>
        {contexts.length === 0 ? (
          <EmptyState
            icon={<Brain size={48} />}
            title="Nenhum contexto criado"
            description="Contextos ajudam a IA a gerar questões mais precisas e alinhadas ao currículo."
            action={{
              label: 'Criar Contexto',
              onClick: () => setModalOpen(true),
            }}
          />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1rem',
            }}
          >
            {contexts.map((ctx) => (
              <Card key={ctx.id} padding="1.25rem">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div>
                    <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                      {ctx.name}
                    </h4>
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {ctx.subject} · {ctx.topic}
                    </p>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-tertiary)',
                        marginTop: '0.375rem',
                      }}
                    >
                      {ctx.gradeLevel} · {ctx.cognitiveLevel} ·{' '}
                      {ctx.languageStyle}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(ctx.id)}
                    icon={<Trash2 size={14} />}
                  />
                </div>
                {ctx.learningObjectives.length > 0 && (
                  <div
                    style={{
                      marginTop: '0.75rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid var(--color-border)',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-tertiary)',
                        marginBottom: '0.375rem',
                      }}
                    >
                      Objetivos:
                    </p>
                    {ctx.learningObjectives.map((obj, i) => (
                      <p
                        key={i}
                        style={{
                          fontSize: '0.8125rem',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        • {obj}
                      </p>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Novo Contexto"
        width="640px"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreate}
              loading={creating}
              disabled={!form.name || !form.subject}
            >
              Criar
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
            }}
          >
            <Input
              label="Nome"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="Nível de ensino"
              value={form.gradeLevel}
              onChange={(e) => setForm({ ...form, gradeLevel: e.target.value })}
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
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
            />
            <Input
              label="Tópico"
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
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
              value={form.cognitiveLevel}
              onChange={(e) =>
                setForm({
                  ...form,
                  cognitiveLevel: e.target.value as CognitiveLevel,
                })
              }
              options={cognitiveLevelOptions}
            />
            <Select
              label="Linguagem"
              value={form.languageStyle}
              onChange={(e) =>
                setForm({
                  ...form,
                  languageStyle: e.target.value as LanguageStyle,
                })
              }
              options={languageStyleOptions}
            />
            <Select
              label="Dificuldade"
              value={form.difficultyStrategy}
              onChange={(e) =>
                setForm({
                  ...form,
                  difficultyStrategy: e.target.value as DifficultyStrategy,
                })
              }
              options={difficultyStrategyOptions}
            />
          </div>
          <TextArea
            label="Material de referência"
            value={form.referenceMaterial || ''}
            onChange={(e) =>
              setForm({ ...form, referenceMaterial: e.target.value })
            }
            placeholder="Textos, instruções..."
          />
        </div>
      </Modal>
    </>
  )
}
