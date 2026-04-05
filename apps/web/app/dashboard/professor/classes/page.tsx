'use client'

import React, { useEffect, useState } from 'react'
import { Header } from '../../../../components/layout/Header'
import { Card } from '../../../../components/ui/Card'
import { Button } from '../../../../components/ui/Button'
import { Input } from '../../../../components/ui/Input'
import { Modal } from '../../../../components/ui/Modal'
import { EmptyState } from '../../../../components/ui/EmptyState'
import { PageLoader } from '../../../../components/ui/Spinner'
import { BookOpen, Plus, Copy, CheckCircle } from 'lucide-react'
import {
  classesService,
  type CreateClassRequest,
} from '../../../../lib/services/classes.service'
import type { Class } from '@repo/api'
import Link from 'next/link'

export default function ProfessorClassesPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<CreateClassRequest>({
    name: '',
    subject: '',
    description: '',
  })
  const [creating, setCreating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    classesService
      .getMyClasses()
      .then(setClasses)
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async () => {
    setCreating(true)
    try {
      const newClass = await classesService.create(form)
      setClasses((prev) => [...prev, newClass])
      setForm({ name: '', subject: '', description: '' })
      setModalOpen(false)
    } finally {
      setCreating(false)
    }
  }

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) return <PageLoader />

  return (
    <>
      <Header
        title="Minhas Turmas"
        subtitle={`${classes.length} turma${classes.length !== 1 ? 's' : ''}`}
        actions={
          <Button
            icon={<Plus size={16} />}
            onClick={() => setModalOpen(true)}
            size="sm"
          >
            Nova Turma
          </Button>
        }
      />
      <div style={{ padding: '2rem' }}>
        {classes.length === 0 ? (
          <EmptyState
            icon={<BookOpen size={48} />}
            title="Nenhuma turma criada"
            description="Crie sua primeira turma para começar a gerar quizzes para seus alunos."
            action={{ label: 'Criar Turma', onClick: () => setModalOpen(true) }}
          />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1rem',
            }}
          >
            {classes.map((cls) => (
              <Link
                key={cls.id}
                href={`/dashboard/professor/classes/${cls.id}`}
                style={{ textDecoration: 'none' }}
              >
                <Card hoverable padding="1.5rem">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h4
                        style={{
                          fontWeight: 600,
                          fontSize: '1rem',
                          marginBottom: '0.25rem',
                        }}
                      >
                        {cls.name}
                      </h4>
                      <p
                        style={{
                          fontSize: '0.8125rem',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {cls.subject}
                      </p>
                      {cls.description && (
                        <p
                          style={{
                            fontSize: '0.8125rem',
                            color: 'var(--color-text-tertiary)',
                            marginTop: '0.5rem',
                          }}
                        >
                          {cls.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '1rem',
                      padding: '0.5rem 0.75rem',
                      backgroundColor: 'var(--color-gray-50)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.8125rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 500,
                      }}
                    >
                      {cls.code}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        copyCode(cls.code, cls.id)
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.75rem',
                        color:
                          copiedId === cls.id
                            ? 'var(--color-success)'
                            : 'var(--color-text-tertiary)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {copiedId === cls.id ? (
                        <CheckCircle size={12} />
                      ) : (
                        <Copy size={12} />
                      )}
                      {copiedId === cls.id ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nova Turma"
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
              Criar Turma
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Nome da turma"
            placeholder="Ex: Turma A - 9º Ano"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Disciplina"
            placeholder="Ex: Matemática"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            required
          />
          <Input
            label="Descrição (opcional)"
            placeholder="Descrição da turma"
            value={form.description || ''}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
      </Modal>
    </>
  )
}
