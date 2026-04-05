'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  FileQuestion,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  History,
  Brain,
} from 'lucide-react'

type NavItem = {
  label: string
  href: string
  icon: React.ReactNode
}

const professorNav: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard/professor',
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: 'Turmas',
    href: '/dashboard/professor/classes',
    icon: <BookOpen size={20} />,
  },
  {
    label: 'Quizzes',
    href: '/dashboard/professor/quizzes',
    icon: <FileQuestion size={20} />,
  },
  {
    label: 'Criar Quiz',
    href: '/dashboard/professor/quizzes/create',
    icon: <Sparkles size={20} />,
  },
  {
    label: 'Contextos IA',
    href: '/dashboard/professor/contexts',
    icon: <Brain size={20} />,
  },
]

const alunoNav: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard/aluno',
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: 'Turmas',
    href: '/dashboard/aluno/classes',
    icon: <GraduationCap size={20} />,
  },
  {
    label: 'Histórico',
    href: '/dashboard/aluno/history',
    icon: <History size={20} />,
  },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const nav = user?.role === 'PROFESSOR' ? professorNav : alunoNav

  return (
    <aside
      style={{
        width: collapsed
          ? 'var(--sidebar-collapsed-width)'
          : 'var(--sidebar-width)',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-white)',
        transition: 'width var(--transition-slow)',
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? '1.5rem 0.75rem' : '1.5rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid var(--color-border)',
          minHeight: 'var(--header-height)',
        }}
      >
        {!collapsed && (
          <Link
            href="/dashboard"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <div
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-gray-950)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-white)',
                fontWeight: 800,
                fontSize: '0.875rem',
              }}
            >
              Q
            </div>
            <span
              style={{
                fontWeight: 700,
                fontSize: '1.125rem',
                letterSpacing: '-0.025em',
              }}
            >
              QuestIA
            </span>
          </Link>
        )}
        {collapsed && (
          <div
            style={{
              width: '2rem',
              height: '2rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-gray-950)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-white)',
              fontWeight: 800,
              fontSize: '0.875rem',
            }}
          >
            Q
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '1.75rem',
            height: '1.75rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-white)',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            flexShrink: 0,
          }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          padding: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          overflowY: 'auto',
        }}
      >
        {nav.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard/professor' &&
              item.href !== '/dashboard/aluno' &&
              pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: collapsed ? '0.625rem' : '0.625rem 0.875rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: isActive ? 500 : 400,
                color: isActive
                  ? 'var(--color-text-primary)'
                  : 'var(--color-text-secondary)',
                backgroundColor: isActive
                  ? 'var(--color-gray-100)'
                  : 'transparent',
                transition: 'all var(--transition-fast)',
                justifyContent: collapsed ? 'center' : 'flex-start',
                textDecoration: 'none',
              }}
              title={collapsed ? item.label : undefined}
            >
              <span style={{ flexShrink: 0, display: 'flex' }}>
                {item.icon}
              </span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User & Logout */}
      <div
        style={{
          padding: '0.75rem',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
        }}
      >
        <Link
          href="/dashboard/profile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: collapsed ? '0.625rem' : '0.625rem 0.875rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            color: 'var(--color-text-secondary)',
            transition: 'all var(--transition-fast)',
            justifyContent: collapsed ? 'center' : 'flex-start',
            textDecoration: 'none',
          }}
          title={collapsed ? 'Configurações' : undefined}
        >
          <Settings size={20} />
          {!collapsed && <span>Configurações</span>}
        </Link>
        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: collapsed ? '0.625rem' : '0.625rem 0.875rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            color: 'var(--color-text-secondary)',
            backgroundColor: 'transparent',
            border: 'none',
            width: '100%',
            transition: 'all var(--transition-fast)',
            justifyContent: collapsed ? 'center' : 'flex-start',
            cursor: 'pointer',
          }}
          title={collapsed ? 'Sair' : undefined}
        >
          <LogOut size={20} />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  )
}
