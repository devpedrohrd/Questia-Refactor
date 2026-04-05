'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'
import { PageLoader } from '../../../components/ui/Spinner'

export default function GoogleCallbackPage() {
  const { refreshUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    refreshUser()
      .then(() => router.replace('/dashboard'))
      .catch(() => router.replace('/login'))
  }, [refreshUser, router])

  return <PageLoader />
}
