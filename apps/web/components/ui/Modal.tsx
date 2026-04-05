'use client'

import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { useIsMobile } from '../../lib/hooks/useIsMobile'

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  width?: string
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  width = '480px',
}: ModalProps) {
  const isMobile = useIsMobile()

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: isMobile ? 'flex-end' : 'center',
        justifyContent: 'center',
        padding: isMobile ? '0' : '1rem',
      }}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          animation: 'fadeIn 150ms ease-out',
        }}
      />
      {/* Content */}
      <div
        style={{
          position: 'relative',
          backgroundColor: 'var(--color-white)',
          borderRadius: isMobile
            ? 'var(--radius-xl) var(--radius-xl) 0 0'
            : 'var(--radius-xl)',
          width: '100%',
          maxWidth: isMobile ? '100%' : width,
          maxHeight: isMobile ? '90vh' : '85vh',
          display: 'flex',
          flexDirection: 'column',
          animation: isMobile
            ? 'fadeInUp 200ms ease-out'
            : 'scaleIn 200ms ease-out',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: isMobile ? '1rem 1.25rem' : '1.25rem 1.5rem',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2rem',
              height: '2rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--color-text-tertiary)',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-gray-100)'
              e.currentTarget.style.color = 'var(--color-text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--color-text-tertiary)'
            }}
          >
            <X size={18} />
          </button>
        </div>
        {/* Body */}
        <div
          style={{
            padding: isMobile ? '1.25rem' : '1.5rem',
            overflowY: 'auto',
            flex: 1,
          }}
        >
          {children}
        </div>
        {/* Footer */}
        {footer && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              padding: isMobile ? '0.75rem 1.25rem' : '1rem 1.5rem',
              borderTop: '1px solid var(--color-border)',
              paddingBottom: isMobile
                ? 'calc(0.75rem + env(safe-area-inset-bottom, 0px))'
                : undefined,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
