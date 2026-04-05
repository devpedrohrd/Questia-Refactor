'use client'

import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { User } from 'lucide-react'

type HeaderProps = {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  const { user } = useAuth()

  return (
    <header
      style={{
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-white)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.3 }}>
          {title}
        </h2>
        {subtitle && (
          <p
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-text-secondary)',
              marginTop: '0.125rem',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {actions}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            padding: '0.375rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              width: '1.75rem',
              height: '1.75rem',
              borderRadius: '50%',
              backgroundColor: 'var(--color-gray-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-secondary)',
            }}
          >
            <User size={14} />
          </div>
          <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
            {user?.name?.split(' ')[0] || 'Usuário'}
          </span>
        </div>
      </div>
    </header>
  )
}
