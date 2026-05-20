'use client'

import { useAuth } from '@/lib/auth/context'
import { useEffect, useState } from 'react'

export default function DebugAuthPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const [cookies, setCookies] = useState('')
  const [localStorage, setLocalStorage] = useState('')

  useEffect(() => {
    setCookies(document.cookie)
    setLocalStorage(JSON.stringify({
      authToken: window.localStorage.getItem('authToken')?.substring(0, 50) + '...' || 'NOT FOUND'
    }))
  }, [])

  return (
    <div className="p-8 bg-white">
      <h1 className="text-3xl font-bold mb-4">Debug Auth</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="border p-4 rounded">
          <h2 className="font-bold mb-2">Auth Context</h2>
          <p><strong>isAuthenticated:</strong> {isAuthenticated ? 'YES' : 'NO'}</p>
          <p><strong>isLoading:</strong> {isLoading ? 'YES' : 'NO'}</p>
          <p><strong>User:</strong> {user ? user.name + ' (' + user.role + ')' : 'NOT SET'}</p>
        </div>

        <div className="border p-4 rounded">
          <h2 className="font-bold mb-2">Cookies</h2>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
            {cookies || 'NO COOKIES FOUND'}
          </pre>
        </div>

        <div className="border p-4 rounded col-span-2">
          <h2 className="font-bold mb-2">LocalStorage</h2>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
            {localStorage}
          </pre>
        </div>

        <div className="border p-4 rounded col-span-2">
          <h2 className="font-bold mb-2">API Test</h2>
          <button 
            onClick={async () => {
              const res = await fetch('/api/auth/me')
              console.log('API /auth/me response:', res.status)
              const data = await res.json()
              console.log('API /auth/me data:', data)
              alert('Check console for response')
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Test /api/auth/me
          </button>
        </div>
      </div>
    </div>
  )
}
