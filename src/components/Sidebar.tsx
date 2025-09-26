import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth, usePermissions } from '@/hooks/useAuth'
import { 
  Building2, 
  Plus, 
  Clock, 
  History, 
  Bell, 
  Zap,
  Users,
  CheckCircle,
  AlertTriangle,
  Settings
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface SidebarItem {
  id: string
  label: string
  icon: React.ReactNode
  path: string
  badge?: number
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { profile } = useAuth()
  const { isComercial, isOnboardingAdmin, isOnboardingExecutive, isSacAdmin, isSacExecutive } = usePermissions()

  // Configurar elementos del sidebar según el rol
  const getSidebarItems = (): SidebarItem[] => {
    if (isComercial()) {
      return [
        {
          id: 'nueva-empresa',
          label: 'Nueva Empresa',
          icon: <Plus className="nav-icon" />,
          path: '/comercial/nueva-empresa'
        },
        {
          id: 'empresas-proceso',
          label: 'Empresas en Proceso',
          icon: <Clock className="nav-icon" />,
          path: '/comercial/empresas-proceso',
          badge: 5
        },
        {
          id: 'historial',
          label: 'Historial de Empresas',
          icon: <History className="nav-icon" />,
          path: '/comercial/historial'
        },
        {
          id: 'notificaciones',
          label: 'Notificaciones',
          icon: <Bell className="nav-icon" />,
          path: '/comercial/notificaciones',
          badge: 3
        }
      ]
    }

    if (isOnboardingAdmin()) {
      return [
        {
          id: 'solicitudes-pendientes',
          label: 'Solicitudes Pendientes',
          icon: <AlertTriangle className="nav-icon" />,
          path: '/onboarding/solicitudes-pendientes',
          badge: 8
        },
        {
          id: 'empresas-proceso',
          label: 'Empresas en Proceso',
          icon: <Clock className="nav-icon" />,
          path: '/onboarding/empresas-proceso'
        },
        {
          id: 'historial',
          label: 'Historial de Empresas',
          icon: <History className="nav-icon" />,
          path: '/onboarding/historial'
        },
        {
          id: 'notificaciones',
          label: 'Notificaciones',
          icon: <Bell className="nav-icon" />,
          path: '/onboarding/notificaciones',
          badge: 2
        }
      ]
    }

    if (isOnboardingExecutive()) {
      return [
        {
          id: 'mis-empresas',
          label: 'Mis Empresas',
          icon: <Building2 className="nav-icon" />,
          path: '/onboarding/mis-empresas'
        },
        {
          id: 'solicitudes-nuevas',
          label: 'Solicitudes Nuevas',
          icon: <Plus className="nav-icon" />,
          path: '/onboarding/solicitudes-nuevas',
          badge: 4
        }
      ]
    }

    if (isSacAdmin()) {
      return [
        {
          id: 'solicitudes-pendientes',
          label: 'Solicitudes Pendientes',
          icon: <AlertTriangle className="nav-icon" />,
          path: '/sac/solicitudes-pendientes',
          badge: 6
        },
        {
          id: 'empresas-sac',
          label: 'Empresas en SAC',
          icon: <Settings className="nav-icon" />,
          path: '/sac/empresas-sac'
        },
        {
          id: 'historial',
          label: 'Historial de Empresas',
          icon: <History className="nav-icon" />,
          path: '/sac/historial'
        }
      ]
    }

    if (isSacExecutive()) {
      return [
        {
          id: 'mis-empresas',
          label: 'Mis Empresas',
          icon: <Building2 className="nav-icon" />,
          path: '/sac/mis-empresas'
        },
        {
          id: 'empresas-pendientes',
          label: 'Empresas Pendientes',
          icon: <Clock className="nav-icon" />,
          path: '/sac/empresas-pendientes',
          badge: 3
        }
      ]
    }

    return []
  }

  const sidebarItems = getSidebarItems()

  // Acciones rápidas según rol
  const getQuickActions = (): SidebarItem[] => {
    if (isComercial()) {
      return [
        {
          id: 'agregar-representante',
          label: 'Agregar Representante',
          icon: <Users className="nav-icon" />,
          path: '/comercial/acciones/representante'
        }
      ]
    }

    if (isOnboardingAdmin()) {
      return [
        {
          id: 'asignar-ejecutivo',
          label: 'Asignar Ejecutivo',
          icon: <Users className="nav-icon" />,
          path: '/onboarding/acciones/asignar'
        },
        {
          id: 'marcar-revisado',
          label: 'Marcar como Revisado',
          icon: <CheckCircle className="nav-icon" />,
          path: '/onboarding/acciones/revisar'
        }
      ]
    }

    if (isOnboardingExecutive()) {
      return [
        {
          id: 'completar-onboarding',
          label: 'Marcar Completado',
          icon: <CheckCircle className="nav-icon" />,
          path: '/onboarding/acciones/completar'
        }
      ]
    }

    if (isSacAdmin()) {
      return [
        {
          id: 'asignar-ejecutivo-sac',
          label: 'Asignar Ejecutivo SAC',
          icon: <Users className="nav-icon" />,
          path: '/sac/acciones/asignar'
        },
        {
          id: 'revisar-pap',
          label: 'Revisar PAP',
          icon: <Settings className="nav-icon" />,
          path: '/sac/acciones/revisar-pap'
        }
      ]
    }

    if (isSacExecutive()) {
      return [
        {
          id: 'completar-pap',
          label: 'Completar PAP',
          icon: <CheckCircle className="nav-icon" />,
          path: '/sac/acciones/completar-pap'
        },
        {
          id: 'solicitar-revision',
          label: 'Solicitar Revisión',
          icon: <AlertTriangle className="nav-icon" />,
          path: '/sac/acciones/solicitar-revision'
        }
      ]
    }

    return []
  }

  const quickActions = getQuickActions()

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 d-lg-none"
          style={{ zIndex: 999 }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'show' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="d-flex align-items-center gap-3">
            <Building2 size={24} />
            <div>
              <h6 className="mb-0">{profile?.nombre}</h6>
              <small className="opacity-75">
                {profile?.perfil?.nombre === 'COM' && 'Área Comercial'}
                {profile?.perfil?.nombre === 'OB' && 'Área Onboarding'}
                {profile?.perfil?.nombre === 'SAC' && 'Área SAC'}
              </small>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="nav flex-column">
            {/* Dashboard */}
            <li className="nav-item">
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Building2 className="nav-icon" />
                Dashboard
              </NavLink>
            </li>

            {/* Separador */}
            <li><hr className="my-3 mx-3" /></li>

            {/* Items principales */}
            {sidebarItems.map((item) => (
              <li key={item.id} className="nav-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  {item.icon}
                  {item.label}
                  {item.badge && (
                    <span className="badge bg-danger rounded-pill ms-auto">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}

            {/* Acciones rápidas */}
            {quickActions.length > 0 && (
              <>
                <li><hr className="my-3 mx-3" /></li>
                <li className="px-3 mb-2">
                  <small className="text-muted font-primary fw-semibold text-uppercase">
                    Acciones Rápidas
                  </small>
                </li>
                {quickActions.map((action) => (
                  <li key={action.id} className="nav-item">
                    <NavLink
                      to={action.path}
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      onClick={onClose}
                    >
                      {action.icon}
                      {action.label}
                    </NavLink>
                  </li>
                ))}
              </>
            )}
          </ul>
        </nav>
      </aside>
    </>
  )
}
