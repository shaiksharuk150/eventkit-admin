'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEMO_EMAIL = 'demo@demo.com'
const DEMO_PASSWORD = 'password'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Initialize auth state from localStorage to persist session on refresh
    const stored = typeof window !== 'undefined' ? localStorage.getItem('auth') : null
    setIsAuthenticated(stored === 'true')
  }, [])

  const login = async (email: string, password: string) => {
    // Simulate authentication check against demo credentials
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      localStorage.setItem('auth', 'true')
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('auth')
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 