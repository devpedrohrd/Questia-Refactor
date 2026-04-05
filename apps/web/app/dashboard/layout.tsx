'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'
import { DashboardShell } from '../../components/layout/DashboardShell'
import { PageLoader } from '../../components/ui/Spinner'
import {
  TutorialProvider,
  useTutorial,
} from '../../components/tutorial/TutorialContext'
import { TutorialOverlay } from '../../components/tutorial/TutorialOverlay'

function TutorialListener() {
  const { startTutorial, hasCompleted } = useTutorial()

  useEffect(() => {
    const handleStart = () => startTutorial()
    window.addEventListener('QUESTIA_START_TUTORIAL', handleStart)

    // Auto-start if not completed
    if (!hasCompleted) {
      // Small timeout to allow layout to settle
      const t = setTimeout(() => startTutorial(), 500)
      return () => {
        window.removeEventListener('QUESTIA_START_TUTORIAL', handleStart)
        clearTimeout(t)
      }
    }

    return () =>
      window.removeEventListener('QUESTIA_START_TUTORIAL', handleStart)
  }, [startTutorial, hasCompleted])

  return null
}

function TutorialWrapper({
  children,
  role,
}: {
  children: React.ReactNode
  role: string
}) {
  return (
    <TutorialProvider role={role}>
      <TutorialListener />
      <TutorialOverlay />
      {children}
    </TutorialProvider>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return <PageLoader />
  }

  return (
    <TutorialWrapper role={user.role}>
      <DashboardShell>{children}</DashboardShell>
    </TutorialWrapper>
  )
}
