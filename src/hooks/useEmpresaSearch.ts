import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import type { EmpresaCompleta } from '@/types/empresa'

interface SearchFilters {
  estado?: 'COMERCIAL' | 'ONBOARDING' | 'SAC' | 'COMPLETADA'
  producto?: 'ENTERFAC' | 'ANDESPOS'
  fechaInicio?: string
  fechaFin?: string
  categoria?: string
}

interface UseEmpresaSearchReturn {
  empresas: EmpresaCompleta[]
  loading: boolean
  error: string | null
  searchQuery: string
  setSearchQuery: (query: string) => void
  filters: SearchFilters
  updateFilters: (newFilters: Partial<SearchFilters>) => void
  totalCount: number
  currentPage: number
  setCurrentPage: (page: number) => void
  pageSize: number
  setPageSize: (size: number) => void
}

export const useEmpresaSearch = (): UseEmpresaSearchReturn => {
  const [empresas, setEmpresas] = useState<EmpresaCompleta[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({})
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)

  const { profile } = useAuth()

  const buildQuery = useCallback(() => {
    let query = supabase
      .from('empresa')
      .select(
        `
        empkey,
        rut,
        nombre,
        empresa_comercial(*),
        empresa_onboarding(*),
        empresa_sac(*)
      `,
        { count: 'exact' }
      )

    if (searchQuery.trim()) {
      query = query.or(`
        rut.ilike.%${searchQuery}%,
        empkey.eq.${searchQuery},
        empresa_comercial.nombre_comercial.ilike.%${searchQuery}%
      `)
    }

    if (filters.estado) {
      if (profile?.perfil?.nombre !== 'COM') {
        query = query.eq('empresa_onboarding.estado', filters.estado)
      }
    }

    if (filters.fechaInicio && filters.fechaFin) {
      query = query
        .gte('empresa_onboarding.fecha_inicio', filters.fechaInicio)
        .lte('empresa_onboarding.fecha_inicio', filters.fechaFin)
    }

    // Para COM muestra todas las empresas sin el filtro por usuario 'created_by'
    if (profile?.perfil?.nombre === 'OB') {
      query = query.in('empresa_onboarding.estado', [
        'ONBOARDING',
        'SAC',
        'COMPLETADA',
      ])
    } else if (profile?.perfil?.nombre === 'SAC') {
      query = query.in('empresa_onboarding.estado', ['SAC', 'COMPLETADA'])
    }

    return query
  }, [searchQuery, filters, profile])

  const searchEmpresas = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const query = buildQuery().range((currentPage - 1) * pageSize, currentPage * pageSize - 1)

      const { data, error: searchError, count } = await query

      if (searchError) throw searchError

      setEmpresas(data || [])
      setTotalCount(count || 0)
    } catch (err: any) {
      setError('Error al buscar empresas: ' + err.message)
    } finally {
      setLoading(false)
    }
  }, [buildQuery, currentPage, pageSize])

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setCurrentPage(1)
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchEmpresas()
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [searchEmpresas])

  useEffect(() => {
    searchEmpresas()
  }, [])

  return {
    empresas,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    filters,
    updateFilters,
    totalCount,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
  }
}
