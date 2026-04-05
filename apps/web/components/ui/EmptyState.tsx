import React from 'react'
import { Button } from './Button'

type EmptyStateProps = {
  icon: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        textAlign: 'center',
        gap: '1rem',
      }}
    >
      <div style={{ color: 'var(--color-text-tertiary)' }}>{icon}</div>
      <div>
        <h4
          style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            marginBottom: '0.375rem',
          }}
        >
          {title}
        </h4>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-text-secondary)',
            maxWidth: '360px',
            margin: '0 auto',
          }}
        >
          {description}
        </p>
      </div>
      {action && (
        <Button
          onClick={action.onClick}
          size="sm"
          style={{ marginTop: '0.5rem' }}
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
