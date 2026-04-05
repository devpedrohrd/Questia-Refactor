'use client'

import React, { useEffect, useState } from 'react'
import { Header } from '../../../../components/layout/Header'
import { Card } from '../../../../components/ui/Card'
import { Button } from '../../../../components/ui/Button'
import { Input } from '../../../../components/ui/Input'
import { Modal } from '../../../../components/ui/Modal'
import { EmptyState } from '../../../../components/ui/EmptyState'
import { PageLoader } from '../../../../components/ui/Spinner'
import { GraduationCap, Plus, LogIn } from 'lucide-react'
import { enrollmentsService } from '../../../../lib/services/enrollments.service'
import { classesService } from '../../../../lib/services/classes.service'
import type { Enrollment, Class } from '@repo/api'
import Link from 'next/link'

export default function AlunoClassesPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [classMap, setClassMap] = useState<Record<string, Class>>({})
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [code, setCode] = useState('')
  const [enrolling, setEnrolling] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const enrollmentsList = await enrollmentsService.getMyEnrollments()
        setEnrollments(enrollmentsList)

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
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleEnroll = async () => {
    setError('')
    setEnrolling(true)
    try {
      const enrollment = await enrollmentsService.enroll(code)
      setEnrollments((prev) => [...prev, enrollment])
      setModalOpen(false)
      setCode('')
      // Fetch the new class details
      try {
        const cls = await classesService.getById(enrollment.classId)
        setClassMap((prev) => ({ ...prev, [cls.id]: cls }))
      } catch {
        /* ignore */
      }
    } catch {
      setError('Código inválido ou você já está matriculado nesta turma.')
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) return <PageLoader />

  return (
    <>
      <Header
        title="Minhas Turmas"
        subtitle={`${enrollments.length} turma${enrollments.length !== 1 ? 's' : ''}`}
        actions={
          <Button
            icon={<LogIn size={16} />}
            size="sm"
            onClick={() => setModalOpen(true)}
          >
            Entrar em Turma
          </Button>
        }
      />
      <div style={{ padding: '2rem' }}>
        {enrollments.length === 0 ? (
          <EmptyState
            icon={<GraduationCap size={48} />}
            title="Nenhuma turma"
            description="Entre em uma turma usando o código fornecido pelo seu professor."
            action={{
              label: 'Entrar em Turma',
              onClick: () => setModalOpen(true),
            }}
          />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem',
            }}
          >
            {enrollments.map((e) => {
              const cls = classMap[e.classId]
              return (
                <Link
                  key={e.id}
                  href={`/dashboard/aluno/classes/${e.classId}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Card hoverable padding="1.5rem">
                    <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                      {cls?.name || '...'}
                    </h4>
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {cls?.subject || ''}
                    </p>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-tertiary)',
                        marginTop: '0.5rem',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      Código: {cls?.code || '...'}
                    </p>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setError('')
        }}
        title="Entrar em Turma"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEnroll} loading={enrolling} disabled={!code}>
              Entrar
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            Insira o código da turma fornecido pelo seu professor.
          </p>
          <Input
            label="Código da turma"
            placeholder="Ex: A1B2C3D4"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            icon={<Plus size={16} />}
          />
          {error && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-error)' }}>
              {error}
            </p>
          )}
        </div>
      </Modal>
    </>
  )
}
