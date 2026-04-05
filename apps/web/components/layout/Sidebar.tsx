'use client'

import React from 'react'
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
  X,
  Sparkles,
  History,
  Brain,
  HelpCircle,
} from 'lucide-react'

type NavItem = {
  label: string
  href: string
  icon: React.ReactNode
  dataTutorial?: string
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
    dataTutorial: 'nav-turmas',
  },
  {
    label: 'Quizzes',
    href: '/dashboard/professor/quizzes',
    icon: <FileQuestion size={20} />,
    dataTutorial: 'nav-quizzes',
  },
  {
    label: 'Criar Quiz',
    href: '/dashboard/professor/quizzes/create',
    icon: <Sparkles size={20} />,
    dataTutorial: 'nav-criar-quiz',
  },
  {
    label: 'Contextos IA',
    href: '/dashboard/professor/contexts',
    icon: <Brain size={20} />,
    dataTutorial: 'nav-contextos',
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
    dataTutorial: 'nav-turmas',
  },
  {
    label: 'Histórico',
    href: '/dashboard/aluno/history',
    icon: <History size={20} />,
    dataTutorial: 'nav-historico',
  },
]

type SidebarProps = {
  isMobile: boolean
  open: boolean
  onClose: () => void
}

export function Sidebar({ isMobile, open, onClose }: SidebarProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const nav = user?.role === 'PROFESSOR' ? professorNav : alunoNav

  const handleNavClick = () => {
    if (isMobile) onClose()
  }

  const sidebarStyle: React.CSSProperties = isMobile
    ? {
        width: 'var(--sidebar-width)',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-white)',
        zIndex: 100,
        overflow: 'hidden',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform var(--transition-slow)',
      }
    : {
        width: 'var(--sidebar-width)',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-white)',
        zIndex: 100,
        overflow: 'hidden',
      }

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && (
        <div
          className={`sidebar-overlay${open ? ' active' : ''}`}
          onClick={onClose}
        />
      )}

      <aside style={sidebarStyle}>
        {/* Logo */}
        <div
          style={{
            padding: '1.5rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--color-border)',
            minHeight: 'var(--header-height)',
          }}
        >
          <Link
            href="/dashboard"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={handleNavClick}
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

          {isMobile && (
            <button
              onClick={onClose}
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
              }}
            >
              <X size={14} />
            </button>
          )}
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
                onClick={handleNavClick}
                data-tutorial={item.dataTutorial}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 0.875rem',
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
                  textDecoration: 'none',
                }}
              >
                <span style={{ flexShrink: 0, display: 'flex' }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
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
          <button
            onClick={() => {
              if (isMobile) onClose()
              window.dispatchEvent(new CustomEvent('QUESTIA_START_TUTORIAL'))
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.625rem 0.875rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
              backgroundColor: 'transparent',
              border: 'none',
              width: '100%',
              transition: 'all var(--transition-fast)',
              cursor: 'pointer',
            }}
          >
            <HelpCircle size={20} />
            <span>Ajuda</span>
          </button>

          <Link
            href="/dashboard/profile"
            onClick={handleNavClick}
            data-tutorial="nav-config"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.625rem 0.875rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
              transition: 'all var(--transition-fast)',
              textDecoration: 'none',
            }}
          >
            <Settings size={20} />
            <span>Configurações</span>
          </Link>
          <button
            onClick={() => {
              logout()
              if (isMobile) onClose()
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.625rem 0.875rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
              backgroundColor: 'transparent',
              border: 'none',
              width: '100%',
              transition: 'all var(--transition-fast)',
              cursor: 'pointer',
            }}
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  )
}
