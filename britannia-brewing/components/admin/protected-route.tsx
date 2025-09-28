// components/admin/protected-route.tsx
import { useRouter } from 'next/router'
import React from 'react'
import { useAuth } from '@/utils/auth-helpers'
import { PageLoading } from '@/components/ui/loading'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireSuperAdmin?: boolean
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireSuperAdmin = false
}) => {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/admin/login')
        return
      }

      if (!profile || (!profile.role || (requireSuperAdmin && profile.role !== 'super_admin'))) {
        router.push('/admin/login')
        return
      }
    }
  }, [user, profile, loading, router, requireSuperAdmin])

  if (loading) {
    return <PageLoading />
  }

  if (!user || !profile?.role || (requireSuperAdmin && profile.role !== 'super_admin')) {
    return <PageLoading />
  }

  return <>{children}</>
}
