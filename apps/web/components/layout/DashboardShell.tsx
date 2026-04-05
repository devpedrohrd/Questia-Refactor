'use client'

import React from 'react'
import { Sidebar } from './Sidebar'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main
        style={{
          marginLeft: 'var(--sidebar-width)',
          flex: 1,
          minHeight: '100vh',
          backgroundColor: 'var(--color-bg-secondary)',
          transition: 'margin-left var(--transition-slow)',
        }}
      >
        {children}
      </main>
    </div>
  )
}
