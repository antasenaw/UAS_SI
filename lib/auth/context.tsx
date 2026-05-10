'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  _id: string
  name: string
  email: string
  noInduk: string
  role: 'Admin' | 'Guru' | 'Siswa'
  status: 'Aktif' | 'Nonaktif'
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (noInduk: string, password: string) => Promise<User>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check token from localStorage first, then cookies
        let token = localStorage.getItem('authToken')
        if (!token) {
          // Try to get from cookies
          const cookies = document.cookie.split(';')
          const authCookie = cookies.find(cookie => cookie.trim().startsWith('authToken='))
          if (authCookie) {
            token = authCookie.split('=')[1]
            // Sync to localStorage
            localStorage.setItem('authToken', token)
          }
        }

        if (token) {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          if (response.ok) {
            const data = await response.json()
            setUser(data.user)
          } else {
            // Clear invalid tokens
            localStorage.removeItem('authToken')
            document.cookie = 'authToken=; path=/; max-age=0'
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (noInduk: string, password: string): Promise<User> => {
    console.log("Auth context login called with:", { noInduk, password: "***" });
    setIsLoading(true)
    try {
      console.log("Making API request to /api/auth/login");
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ noInduk, password })
      })

      console.log("API response status:", response.status);
      console.log("API response ok:", response.ok);

      if (!response.ok) {
        const error = await response.json()
        console.log("API error response:", error);
        throw new Error(error.error || 'Login gagal')
      }

      const data = await response.json()
      console.log("API success response:", { success: data.success, message: data.message, user: data.user, tokenLength: data.token?.length });

      // Store token in localStorage (server sets cookie via Set-Cookie header)
      console.log("Storing token in localStorage");
      localStorage.setItem('authToken', data.token)
      console.log("Stored in localStorage, token length:", data.token?.length);
      
      console.log("Setting user in context");
      setUser(data.user)
      console.log("User set in context:", data.user);
      return data.user
    } catch (error) {
      console.error("Login error in auth context:", error);
      throw error;
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    document.cookie = 'authToken=; path=/; max-age=0'
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
