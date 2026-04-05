'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { authService } from '../../../lib/services/auth.service'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authService.forgotPassword(email)
      setSent(true)
    } catch {
      setError('E-mail não encontrado.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
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
          E-mail enviado!
        </h2>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-text-secondary)',
            maxWidth: '320px',
          }}
        >
          Enviamos um link de redefinição de senha para <strong>{email}</strong>
          . Verifique sua caixa de entrada.
        </p>
        <Link
          href="/login"
          style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            textDecoration: 'underline',
            marginTop: '0.5rem',
          }}
        >
          Voltar ao login
        </Link>
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
          Esqueceu a senha?
        </h1>
        <p
          style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}
        >
          Informe seu e-mail para receber um link de redefinição
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          icon={<Mail size={16} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          Enviar link
        </Button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <Link
          href="/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            fontSize: '0.8125rem',
            color: 'var(--color-text-secondary)',
          }}
        >
          <ArrowLeft size={14} />
          Voltar ao login
        </Link>
      </p>
    </>
  )
}
