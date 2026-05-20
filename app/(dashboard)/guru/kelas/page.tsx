"use client"

import Link from 'next/link'
import { useMemo, useEffect, useState } from 'react'
import { BookOpen, Users, FileText } from 'lucide-react'
import { useSearch } from '@/app/providers'

interface Kelas {
  id: string
  nama: string
  tingkat?: string
  jumlahSiswa: number
  mataPelajaran: string
  jumlahMateri?: number
  jumlahPekerjaan?: number
}

export default function GuruKelasPage() {
  const [classes, setClasses] = useState<Kelas[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { searchQuery } = useSearch()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null)
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
        const headers: any = {}
        if (token) headers.Authorization = `Bearer ${token}`

        const res = await fetch('/api/guru/dashboard', { headers, credentials: 'include' })
        const data = await res.json()
        if (!res.ok || !data.success) {
          setError(data.error || 'Gagal memuat kelas')
          setClasses([])
        } else {
          setClasses((data.classes || []).map((c: any) => ({
            id: c.id,
            nama: c.nama,
            tingkat: '',
            jumlahSiswa: c.jumlahSiswa || 0,
            mataPelajaran: c.mataPelajaran || '-',
            jumlahMateri: 0,
            jumlahPekerjaan: 0,
          })))
        }
      } catch (err: any) {
        console.error(err)
        setError(err?.message || 'Terjadi kesalahan saat memuat kelas')
        setClasses([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const normalizedSearch = searchQuery.toLowerCase().trim()
  const kelasToShow = useMemo(
    () => classes.filter(k => [k.nama, k.mataPelajaran].some(v => v.toLowerCase().includes(normalizedSearch))),
    [normalizedSearch, classes]
  )

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Kelas yang Saya Ajar</h1>
        <p className="text-gray-600">Kelola materi dan pekerjaan untuk setiap kelas</p>
      </div>

      {error && (
        <div className="mb-6 text-red-600">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kelasToShow.length > 0 ? kelasToShow.map((kelas: any) => (
          <Link
            key={kelas.id}
            href={`/guru/kelas/${kelas.id}`}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100"
          >
            <div className="h-24 bg-linear-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <BookOpen size={40} className="text-white opacity-80" />
            </div>

            <div className="p-6">
              <h2 className="text-xl font-bold text-black mb-1">{kelas.nama}</h2>
              <p className="text-sm text-gray-500 mb-4">{kelas.mataPelajaran}</p>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <Users size={18} className="text-blue-500" />
                  <span className="text-sm"><strong>{kelas.jumlahSiswa}</strong> siswa</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <FileText size={18} className="text-green-500" />
                  <span className="text-sm">
                    <strong>{kelas.jumlahMateri}</strong> materi • <strong>{kelas.jumlahPekerjaan}</strong> tugas
                  </span>
                </div>
              </div>

              <button className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm">
                Lihat Kelas →
              </button>
            </div>
          </Link>
        )) : (
          <div className="col-span-full text-center py-16 text-gray-600">Belum ada kelas yang diajar.</div>
        )}
      </div>
    </div>
  )
}
