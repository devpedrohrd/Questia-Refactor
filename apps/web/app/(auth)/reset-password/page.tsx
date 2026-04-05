'use client'

import React, { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { PageLoader } from '../../../components/ui/Spinner'
import { Lock, CheckCircle } from 'lucide-react'
import { authService } from '../../../lib/services/auth.service'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (!token) {
      setError('Token inválido. Solicite um novo link.')
      return
    }
    setLoading(true)
    try {
      await authService.resetPassword(token, password)
      setDone(true)
    } catch {
      setError('Token inválido ou expirado. Solicite um novo link.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1rem',
          padding: '1rem 0',
        }}
      >
        <CheckCircle size={48} style={{ color: 'var(--color-success)' }} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
          Senha redefinida!
        </h2>
        <p
          style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}
        >
          Sua senha foi alterada com sucesso.
        </p>
        <Button
          onClick={() => router.push('/login')}
          size="sm"
          style={{ marginTop: '0.5rem' }}
        >
          Ir para o login
        </Button>
      </div>
    )
  }

  return (
    <>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '0.375rem',
          }}
        >
          Redefinir senha
        </h1>
        <p
          style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}
        >
          Digite sua nova senha
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <Input
          label="Nova senha"
          type="password"
          placeholder="Mínimo 6 caracteres"
          icon={<Lock size={16} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <Input
          label="Confirmar senha"
          type="password"
          placeholder="Repita a senha"
          icon={<Lock size={16} />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {error && (
          <p
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-error)',
              textAlign: 'center',
            }}
          >
            {error}
          </p>
        )}

        <Button type="submit" loading={loading} style={{ width: '100%' }}>
          Redefinir senha
        </Button>
      </form>

      <p
        style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontSize: '0.8125rem',
          color: 'var(--color-text-secondary)',
        }}
      >
        <Link href="/login" style={{ textDecoration: 'underline' }}>
          Voltar ao login
        </Link>
      </p>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ResetPasswordForm />
    </Suspense>
  )
}
