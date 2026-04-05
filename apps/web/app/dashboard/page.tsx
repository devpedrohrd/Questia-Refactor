'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'
import { PageLoader } from '../../components/ui/Spinner'

export default function DashboardRootPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (user) {
      router.replace(
        user.role === 'PROFESSOR' ? '/dashboard/professor' : '/dashboard/aluno',
      )
    }
  }, [user, loading, router])

  return <PageLoader />
}
