'use client'

import React, { useState } from 'react'
import { Sidebar } from './Sidebar'
import { useIsMobile } from '../../lib/hooks/useIsMobile'
import { Menu } from 'lucide-react'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        isMobile={isMobile}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main
        style={{
          marginLeft: isMobile ? 0 : 'var(--sidebar-width)',
          flex: 1,
          minHeight: '100vh',
          backgroundColor: 'var(--color-bg-secondary)',
          transition: 'margin-left var(--transition-slow)',
          width: isMobile ? '100%' : undefined,
        }}
      >
        {/* Mobile top bar with hamburger */}
        {isMobile && (
          <div
            style={{
              height: 'var(--header-height)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 1rem',
              borderBottom: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-white)',
              position: 'sticky',
              top: 0,
              zIndex: 50,
            }}
          >
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2.25rem',
                height: '2.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-white)',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
              }}
              aria-label="Abrir menu"
            >
              <Menu size={18} />
            </button>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <div
                style={{
                  width: '1.75rem',
                  height: '1.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-gray-950)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-white)',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                }}
              >
                Q
              </div>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '1rem',
                  letterSpacing: '-0.025em',
                }}
              >
                QuestIA
              </span>
            </div>
            <div style={{ width: '2.25rem' }} /> {/* spacer for centering */}
          </div>
        )}
        {children}
      </main>
    </div>
  )
}
