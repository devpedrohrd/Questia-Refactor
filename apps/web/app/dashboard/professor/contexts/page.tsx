'use client'

import React, { useEffect, useState } from 'react'
import { Header } from '../../../../components/layout/Header'
import { Card } from '../../../../components/ui/Card'
import { Button } from '../../../../components/ui/Button'
import { Modal } from '../../../../components/ui/Modal'
import { Input, TextArea, Select } from '../../../../components/ui/Input'
import { EmptyState } from '../../../../components/ui/EmptyState'
import { PageLoader } from '../../../../components/ui/Spinner'
import { Brain, Plus, Trash2, Edit3 } from 'lucide-react'
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

const EMPTY_FORM: CreateGenerationContextRequest = {
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
}

export default function ProfessorContextsPage() {
  const [contexts, setContexts] = useState<GenerationContext[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CreateGenerationContextRequest>({
    ...EMPTY_FORM,
  })

  useEffect(() => {
    generationContextsService
      .getMyContexts()
      .then(setContexts)
      .finally(() => setLoading(false))
  }, [])

  const openCreateModal = () => {
    setEditingId(null)
    setForm({ ...EMPTY_FORM, learningObjectives: [''], rules: [''] })
    setModalOpen(true)
  }

  const openEditModal = (ctx: GenerationContext) => {
    setEditingId(ctx.id)
    setForm({
      name: ctx.name,
      gradeLevel: ctx.gradeLevel,
      subject: ctx.subject,
      topic: ctx.topic,
      learningObjectives:
        ctx.learningObjectives.length > 0 ? ctx.learningObjectives : [''],
      cognitiveLevel: ctx.cognitiveLevel,
      languageStyle: ctx.languageStyle,
      difficultyStrategy: ctx.difficultyStrategy,
      rules: ctx.rules && ctx.rules.length > 0 ? ctx.rules : [''],
      referenceMaterial: ctx.referenceMaterial || '',
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        ...form,
        learningObjectives: form.learningObjectives.filter(Boolean),
        rules: form.rules.filter(Boolean),
      }

      if (editingId) {
        const updated = await generationContextsService.update(
          editingId,
          payload,
        )
        setContexts((prev) =>
          prev.map((c) => (c.id === editingId ? updated : c)),
        )
      } else {
        const created = await generationContextsService.create(payload)
        setContexts((prev) => [...prev, created])
      }

      setModalOpen(false)
      setEditingId(null)
      setForm({ ...EMPTY_FORM, learningObjectives: [''], rules: [''] })
    } finally {
      setSaving(false)
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
          <Button icon={<Plus size={16} />} size="sm" onClick={openCreateModal}>
            Novo Contexto
          </Button>
        }
      />
      <div className="page-padding" style={{ padding: '2rem' }}>
        {contexts.length === 0 ? (
          <EmptyState
            icon={<Brain size={48} />}
            title="Nenhum contexto criado"
            description="Contextos ajudam a IA a gerar questões mais precisas e alinhadas ao currículo."
            action={{
              label: 'Criar Contexto',
              onClick: openCreateModal,
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
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(ctx)}
                      icon={<Edit3 size={14} />}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(ctx.id)}
                      icon={<Trash2 size={14} />}
                    />
                  </div>
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

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingId(null)
        }}
        title={editingId ? 'Editar Contexto' : 'Novo Contexto'}
        width="640px"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setModalOpen(false)
                setEditingId(null)
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              loading={saving}
              disabled={!form.name || !form.subject}
            >
              {editingId ? 'Salvar' : 'Criar'}
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            className="grid-responsive"
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
            className="grid-responsive"
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
            className="grid-responsive"
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
