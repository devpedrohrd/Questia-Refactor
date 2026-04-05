'use client'

import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { User } from 'lucide-react'
import { useIsMobile } from '../../lib/hooks/useIsMobile'

type HeaderProps = {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  const { user } = useAuth()
  const isMobile = useIsMobile()

  return (
    <header
      style={{
        minHeight: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '0.75rem 1rem' : '0 2rem',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-white)',
        position: 'sticky',
        top: isMobile ? 'var(--header-height)' : 0,
        zIndex: 40,
        gap: '0.75rem',
        flexWrap: isMobile ? 'wrap' : 'nowrap',
      }}
    >
      <div style={{ minWidth: 0, flex: 1 }}>
        <h2
          style={{
            fontSize: isMobile ? '1rem' : '1.25rem',
            fontWeight: 700,
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            style={{
              fontSize: isMobile ? '0.75rem' : '0.8125rem',
              color: 'var(--color-text-secondary)',
              marginTop: '0.125rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '0.5rem' : '1rem',
          flexShrink: 0,
        }}
      >
        {actions}
        {!isMobile && (
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
        )}
      </div>
    </header>
  )
}
