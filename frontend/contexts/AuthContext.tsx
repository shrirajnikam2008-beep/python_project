'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authLogin, authSignup, authLogout, getCurrentUser } from '@/lib/api'
import type { AuthUser } from '@/lib/api'

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = getCurrentUser()
    setUser(stored)
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const u = await authLogin(email, password)
    setUser(u)
  }, [])

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const u = await authSignup(name, email, password)
    setUser(u)
  }, [])

  const logout = useCallback(async () => {
    await authLogout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
