'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: 500,
    borderRadius: 'var(--radius-md)',
    border: '1px solid transparent',
    transition: 'all var(--transition-fast)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.5 : 1,
    whiteSpace: 'nowrap',
    lineHeight: 1,
    fontFamily: 'inherit',
    fontSize: size === 'sm' ? '0.8125rem' : size === 'lg' ? '1rem' : '0.875rem',
    padding:
      size === 'sm'
        ? '0.5rem 0.875rem'
        : size === 'lg'
          ? '0.75rem 1.5rem'
          : '0.625rem 1.25rem',
    ...variantStyles[variant],
    ...style,
  }

  return (
    <button style={baseStyle} disabled={disabled || loading} {...props}>
      {loading ? (
        <Loader2
          size={size === 'sm' ? 14 : 16}
          style={{ animation: 'spin 1s linear infinite' }}
        />
      ) : (
        icon
      )}
      {children}
    </button>
  )
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: 'var(--color-gray-950)',
    color: 'var(--color-white)',
    borderColor: 'var(--color-gray-950)',
  },
  secondary: {
    backgroundColor: 'transparent',
    color: 'var(--color-gray-950)',
    borderColor: 'var(--color-border)',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--color-text-secondary)',
    borderColor: 'transparent',
  },
  danger: {
    backgroundColor: 'var(--color-error)',
    color: 'var(--color-white)',
    borderColor: 'var(--color-error)',
  },
}
