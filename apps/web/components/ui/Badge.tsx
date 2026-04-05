import React from 'react'

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'outline'

type BadgeProps = {
  children: React.ReactNode
  variant?: BadgeVariant
}

const variants: Record<BadgeVariant, React.CSSProperties> = {
  default: {
    backgroundColor: 'var(--color-gray-100)',
    color: 'var(--color-gray-700)',
  },
  success: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  warning: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  outline: {
    backgroundColor: 'transparent',
    color: 'var(--color-text-secondary)',
    border: '1px solid var(--color-border)',
  },
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: '0.6875rem',
        fontWeight: 500,
        padding: '0.2rem 0.5rem',
        borderRadius: 'var(--radius-full)',
        lineHeight: 1.4,
        letterSpacing: '0.01em',
        textTransform: 'uppercase',
        ...variants[variant],
      }}
    >
      {children}
    </span>
  )
}

export function QuizStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    DRAFT: { label: 'Rascunho', variant: 'default' },
    GENERATED: { label: 'Gerado', variant: 'warning' },
    PUBLISHED: { label: 'Publicado', variant: 'success' },
    ARCHIVED: { label: 'Arquivado', variant: 'outline' },
  }
  const { label, variant } = map[status] || {
    label: status,
    variant: 'default' as BadgeVariant,
  }
  return <Badge variant={variant}>{label}</Badge>
}
