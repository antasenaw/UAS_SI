'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/context'
import { Save } from 'lucide-react'

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
        const res = await fetch('/api/notifications', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        if (res.ok) {
          const json = await res.json()
          setNotifications(json.data || [])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [user])

  const markAsRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifikasi</h1>
        <Link href="/" className="text-sm text-blue-600">Kembali</Link>
      </div>

      {loading ? (
        <div className="text-gray-600">Memuat notifikasi...</div>
      ) : notifications.length === 0 ? (
        <div className="text-gray-600">Saya tidak ada notifikasi</div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className={`p-4 rounded border ${n.read ? 'bg-white' : 'bg-blue-50 border-blue-100'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{n.title}</h3>
                  <p className="text-sm text-gray-700">{n.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                </div>
                {!n.read && (
                  <button onClick={() => markAsRead(n.id)} className="text-sm text-blue-600 flex items-center gap-2">
                    <Save size={14} /> Tandai dibaca
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
