import React from 'react'

type CardProps = {
  children: React.ReactNode
  padding?: string
  style?: React.CSSProperties
  onClick?: () => void
  hoverable?: boolean
}

export function Card({
  children,
  padding = '1.5rem',
  style,
  onClick,
  hoverable,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'var(--color-white)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding,
        transition: 'all var(--transition-fast)',
        cursor: onClick || hoverable ? 'pointer' : 'default',
        ...(hoverable ? { boxShadow: 'var(--shadow-sm)' } : {}),
        ...style,
      }}
      onMouseEnter={(e) => {
        if (onClick || hoverable) {
          e.currentTarget.style.borderColor = 'var(--color-border-hover)'
          e.currentTarget.style.boxShadow = 'var(--shadow-md)'
        }
      }}
      onMouseLeave={(e) => {
        if (onClick || hoverable) {
          e.currentTarget.style.borderColor = 'var(--color-border)'
          e.currentTarget.style.boxShadow = hoverable
            ? 'var(--shadow-sm)'
            : 'none'
        }
      }}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '1rem',
        marginBottom: '1rem',
        borderBottom: '1px solid var(--color-border)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
