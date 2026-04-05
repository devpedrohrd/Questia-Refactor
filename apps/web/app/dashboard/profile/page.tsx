'use client'

import React, { useState } from 'react'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Header } from '../../../components/layout/Header'
import { useAuth } from '../../../contexts/AuthContext'
import { usersService } from '../../../lib/services/users.service'
import { Modal } from '../../../components/ui/Modal'
import { User, Mail, Lock, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { user, refreshUser, logout } = useAuth()
  const router = useRouter()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [deleteModal, setDeleteModal] = useState(false)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const data: Record<string, string> = {}
      if (name !== user?.name) data.name = name
      if (email !== user?.email) data.email = email
      if (password) data.password = password
      await usersService.update(user!.id, data)
      await refreshUser()
      setPassword('')
      setSuccess('Perfil atualizado com sucesso!')
    } catch {
      setError('Erro ao atualizar perfil.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await usersService.delete(user!.id)
      await logout()
      router.push('/login')
    } catch {
      setError('Erro ao excluir conta.')
    }
  }

  return (
    <>
      <Header
        title="Meu Perfil"
        subtitle="Gerencie suas informações pessoais"
      />
      <div style={{ padding: '2rem', maxWidth: '600px' }}>
        <Card>
          <form
            onSubmit={handleUpdate}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            <Input
              label="Nome"
              icon={<User size={16} />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="E-mail"
              type="email"
              icon={<Mail size={16} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Nova senha (opcional)"
              type="password"
              icon={<Lock size={16} />}
              placeholder="Deixe em branco para manter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {success && (
              <p
                style={{ fontSize: '0.8125rem', color: 'var(--color-success)' }}
              >
                {success}
              </p>
            )}
            {error && (
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-error)' }}>
                {error}
              </p>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '0.5rem',
              }}
            >
              <Button
                type="button"
                variant="danger"
                size="sm"
                icon={<Trash2 size={14} />}
                onClick={() => setDeleteModal(true)}
              >
                Excluir conta
              </Button>
              <Button type="submit" loading={loading}>
                Salvar alterações
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Excluir conta"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Excluir permanentemente
            </Button>
          </>
        }
      >
        <p
          style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}
        >
          Tem certeza que deseja excluir sua conta? Esta ação é{' '}
          <strong>irreversível</strong> e todos os seus dados serão perdidos.
        </p>
      </Modal>
    </>
  )
}
