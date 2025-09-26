import type { ReactNode } from 'react'
import { createContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface Perfil {
  nombre: 'COM' | 'OB' | 'OB_ADMIN' | 'SAC' | 'SAC_ADMIN'
}

export interface Profile {
  rut: string
  perfil: Perfil
}

export interface AuthContextType {
  profile: Profile | null
  hasRole: (role: string) => boolean
  hasPermission: (permission: string) => boolean
  logout: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [permissions, setPermissions] = useState<string[]>([])

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession()
      const session = data?.session
      if (session?.user?.email) {
        fetchProfile(session.user.email)
      }
    }
    fetchSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        fetchProfile(session.user.email)
      } else {
        setProfile(null)
        setPermissions([])
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (email?: string) => {
    if (!email) return

    const { data, error } = await supabase
      .from('usuario')
      .select('rut, perfil:perfil_usuarios(nombre)')
      .eq('correo', email) // filtramos por correo
      .single()

    if (error || !data || !('perfil' in data)) {
      setProfile(null)
      setPermissions([])
      return
    }

    setProfile({
      rut: (data as any).rut,
      perfil: { nombre: (data as any).perfil.nombre }
    })

    let permisos: string[] = []
    switch ((data as any).perfil.nombre) {
      case 'COM':
        permisos = ['edit_comercial', 'view_historial', 'assign_tasks']
        break
      case 'OB':
        permisos = ['edit_onboarding', 'view_historial']
        break
      case 'OB_ADMIN':
        permisos = ['edit_onboarding', 'view_historial', 'assign_tasks', 'admin']
        break
      case 'SAC':
        permisos = ['edit_sac', 'view_historial']
        break
      case 'SAC_ADMIN':
        permisos = ['edit_sac', 'view_historial', 'admin']
        break
      default:
        permisos = []
    }
    setPermissions(permisos)
  }

  const hasRole = useCallback(
    (role: string) => profile?.perfil?.nombre === role,
    [profile]
  )

  const hasPermission = useCallback(
    (permission: string) => permissions.includes(permission),
    [permissions]
  )

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setProfile(null)
    setPermissions([])
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    if (data?.user?.email) {
      await fetchProfile(data.user.email)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ profile, hasRole, hasPermission, logout, login }}>
      {children}
    </AuthContext.Provider>
  )
}
