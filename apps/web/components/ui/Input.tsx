'use client'

import React from 'react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export function Input({ label, error, icon, style, ...props }: InputProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem',
        width: '100%',
      }}
    >
      {label && (
        <label
          style={{
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: 'var(--color-text-primary)',
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <span
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-tertiary)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {icon}
          </span>
        )}
        <input
          style={{
            width: '100%',
            padding: icon
              ? '0.625rem 0.875rem 0.625rem 2.5rem'
              : '0.625rem 0.875rem',
            fontSize: '0.875rem',
            border: `1px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-white)',
            color: 'var(--color-text-primary)',
            outline: 'none',
            transition: 'border-color var(--transition-fast)',
            fontFamily: 'inherit',
            ...style,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = error
              ? 'var(--color-error)'
              : 'var(--color-gray-950)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error
              ? 'var(--color-error)'
              : 'var(--color-border)'
          }}
          {...props}
        />
      </div>
      {error && (
        <span style={{ fontSize: '0.75rem', color: 'var(--color-error)' }}>
          {error}
        </span>
      )}
    </div>
  )
}

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  error?: string
}

export function TextArea({ label, error, style, ...props }: TextAreaProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem',
        width: '100%',
      }}
    >
      {label && (
        <label
          style={{
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: 'var(--color-text-primary)',
          }}
        >
          {label}
        </label>
      )}
      <textarea
        style={{
          width: '100%',
          padding: '0.625rem 0.875rem',
          fontSize: '0.875rem',
          border: `1px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-white)',
          color: 'var(--color-text-primary)',
          outline: 'none',
          resize: 'vertical',
          minHeight: '5rem',
          fontFamily: 'inherit',
          transition: 'border-color var(--transition-fast)',
          ...style,
        }}
        {...props}
      />
      {error && (
        <span style={{ fontSize: '0.75rem', color: 'var(--color-error)' }}>
          {error}
        </span>
      )}
    </div>
  )
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export function Select({
  label,
  error,
  options,
  style,
  ...props
}: SelectProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem',
        width: '100%',
      }}
    >
      {label && (
        <label
          style={{
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: 'var(--color-text-primary)',
          }}
        >
          {label}
        </label>
      )}
      <select
        style={{
          width: '100%',
          padding: '0.625rem 0.875rem',
          fontSize: '0.875rem',
          border: `1px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-white)',
          color: 'var(--color-text-primary)',
          outline: 'none',
          fontFamily: 'inherit',
          cursor: 'pointer',
          appearance: 'none',
          ...style,
        }}
        {...props}
      >
        <option value="">Selecionar...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span style={{ fontSize: '0.75rem', color: 'var(--color-error)' }}>
          {error}
        </span>
      )}
    </div>
  )
}
