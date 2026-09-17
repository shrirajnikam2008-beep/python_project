'use client'

import { useState, useEffect } from 'react'
import type { StudentProfile } from '@/lib/types'
import { getStudentProfile, createStudentProfile } from '@/lib/api'

interface UseStudentProfileReturn {
  profile: StudentProfile | null
  loading: boolean
  error: string | null
  saveProfile: (profile: StudentProfile) => Promise<void>
  refresh: () => void
}

export function useStudentProfile(): UseStudentProfileReturn {
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getStudentProfile()
      .then((data) => {
        if (!cancelled) setProfile(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load profile')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [refreshKey])

  const saveProfile = async (newProfile: StudentProfile) => {
    setLoading(true)
    try {
      const saved = await createStudentProfile(newProfile)
      setProfile(saved)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  const refresh = () => setRefreshKey((k) => k + 1)

  return { profile, loading, error, saveProfile, refresh }
}
