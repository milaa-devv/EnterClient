import { useContext, useCallback } from 'react'
import { AuthContext, type AuthContextType } from '@/contexts/AuthContext'

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}

export const usePermissions = () => {
  const { hasRole, hasPermission, profile } = useAuth()

  return {
    isComercial: () => hasRole('COM'),
    isOnboardingAdmin: () => hasRole('OB') && profile?.perfil?.nombre === 'OB',
    isOnboardingExecutive: () => hasRole('OB') && profile?.perfil?.nombre === 'OB',
    isSacAdmin: () => hasRole('SAC') && profile?.perfil?.nombre === 'SAC',
    isSacExecutive: () => hasRole('SAC') && profile?.perfil?.nombre === 'SAC',

    canEditComercial: () => hasPermission('edit_comercial'),
    canEditOnboarding: () => hasPermission('edit_onboarding'),
    canEditSac: () => hasPermission('edit_sac'),
    canViewHistorial: () => hasPermission('view_historial'),
    canAssignTasks: () => hasPermission('assign_tasks'),

    hasRole,
    hasPermission,
  }
}

export const useSignIn = (): ((
  email: string,
  password: string
) => Promise<void>) => {
  const { login } = useAuth()

  const signIn = useCallback(
    async (email: string, password: string) => {
      await login(email, password)
    },
    [login]
  )

  return signIn
}

export const useLogout = (): (() => Promise<void>) => {
  const { logout } = useAuth()

  const doLogout = useCallback(async () => {
    await logout()
  }, [logout])

  return doLogout
}
