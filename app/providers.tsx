'use client'

import { createContext, useContext, useState } from 'react'
import { AuthProvider } from '@/lib/auth/context'

interface SearchContextType {
  searchQuery: string
  setSearchQuery: (value: string) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export default function Providers({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <AuthProvider>
      <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
        {children}
      </SearchContext.Provider>
    </AuthProvider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within Providers')
  }
  return context
}
