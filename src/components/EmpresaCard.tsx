import React from 'react'
import { Link } from 'react-router-dom'
import { Building2, Calendar, MapPin, Phone, Mail } from 'lucide-react'
import { getStatusLabel, formatDate, formatRut } from '@/lib/utils'
import type { EmpresaCompleta } from '@/types/empresa'

interface EmpresaCardProps {
  empresa: EmpresaCompleta
}

const SUPABASE_PUBLIC_URL = 'https://zaewjhhtvnoyoisitkog.supabase.co/storage/v1/object/public/logos'

// Siempre usa esta función para asegurar la URL pública correcta del logo
const getLogoUrl = (logoPath?: string): string | undefined => {
  if (!logoPath) return undefined
  if (logoPath.startsWith('http')) return logoPath
  const fileName = logoPath.split('/').pop() || logoPath
  return `${SUPABASE_PUBLIC_URL}/${fileName}`
}

export const EmpresaCard: React.FC<EmpresaCardProps> = ({ empresa }) => {
  const estado = empresa.estado ?? ''
  const statusLabel = getStatusLabel(estado)

  // DEBUG: Verifica el valor recibido y la URL final construida
  console.log('logo raw:', empresa.comercial?.datosGenerales?.logo)
  const logoSrc: string | undefined = getLogoUrl(empresa.comercial?.datosGenerales?.logo || undefined)
  console.log('logo url:', logoSrc)

  return (
    <Link to={`/empresa/${empresa.empkey}`} className="text-decoration-none">
      <div className="empresa-card h-100">
        <div className="d-flex gap-3 mb-3">
          <div className="empresa-logo">
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={empresa.comercial.datosGenerales?.nombre ?? 'Logo'}
                className="w-100 h-100 object-fit-cover rounded"
              />
            ) : (
              <Building2 size={28} className="text-muted" />
            )}
          </div>

          <div className="empresa-info flex-grow-1 min-width-0">
            <h5 className="empresa-nombre text-truncate">
              {empresa.comercial?.datosGenerales?.nombre ?? 'Sin nombre'}
            </h5>
            <p className="empresa-rut mb-1">
              {empresa.comercial?.datosGenerales?.rut
                ? formatRut(empresa.comercial.datosGenerales.rut)
                : 'Sin RUT'}
            </p>
            <p className="empresa-empkey mb-0">
              Empkey: <strong>{empresa.empkey}</strong>
            </p>
          </div>

          <div className="flex-shrink-0">
            <span className={`empresa-status status-${estado.toLowerCase()}`}>
              {statusLabel || 'Estado desconocido'}
            </span>
          </div>
        </div>

        <div className="border-top pt-3">
          <div className="row g-2">
            {empresa.comercial?.datosGenerales?.fecha_inicio && (
              <div className="col-12">
                <div className="d-flex align-items-center gap-2 text-muted small">
                  <Calendar size={14} />
                  <span>Inicio: {formatDate(empresa.comercial.datosGenerales.fecha_inicio)}</span>
                </div>
              </div>
            )}
            {empresa.comercial?.datosContacto?.domicilio && (
              <div className="col-12">
                <div className="d-flex align-items-center gap-2 text-muted small">
                  <MapPin size={14} />
                  <span className="text-truncate">{empresa.comercial.datosContacto.domicilio}</span>
                </div>
              </div>
            )}
            <div className="col-6">
              {empresa.comercial?.datosContacto?.telefono && (
                <div className="d-flex align-items-center gap-1 text-muted small">
                  <Phone size={12} />
                  <span className="text-truncate">{empresa.comercial.datosContacto.telefono}</span>
                </div>
              )}
            </div>
            <div className="col-6">
              {empresa.comercial?.datosContacto?.correo && (
                <div className="d-flex align-items-center gap-1 text-muted small">
                  <Mail size={12} />
                  <span className="text-truncate">{empresa.comercial.datosContacto.correo}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {empresa.comercial?.informacionPlan && (
          <div className="border-top pt-2 mt-2">
            <div className="d-flex gap-1 flex-wrap">
              <span
                className={`badge ${
                  empresa.comercial.informacionPlan.producto === 'ENTERFAC'
                    ? 'bg-primary'
                    : 'bg-success'
                }`}
              >
                {empresa.comercial.informacionPlan.producto}
              </span>
              {empresa.comercial.informacionPlan.codigo_plan && (
                <span className="badge bg-secondary">
                  {empresa.comercial.informacionPlan.codigo_plan}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}
