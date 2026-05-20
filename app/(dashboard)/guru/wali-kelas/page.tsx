"use client"

import Link from 'next/link'
import { useSearch } from '@/app/providers'
import { Users } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function GuruWaliKelasPage() {
  const { searchQuery } = useSearch()
  const normalizedSearch = searchQuery.toLowerCase().trim()
  const searchActive = normalizedSearch.length > 0

  const [waliClassName, setWaliClassName] = useState<string | null>(null)
  const [siswaList, setSiswaList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
          setError(data.error || 'Gagal memuat data wali kelas')
          setSiswaList([])
          setWaliClassName(null)
        } else {
          setWaliClassName(data.waliKelasClassName || null)
          setSiswaList(data.siswaAnalisa || [])
        }
      } catch (err: any) {
        console.error(err)
        setError(err?.message || 'Terjadi kesalahan saat memuat data')
        setSiswaList([])
        setWaliClassName(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredSiswa = siswaList.filter((siswa) =>
    [siswa.nama, siswa.nis || '', siswa.noUrut || ''].some((value) =>
      value.toLowerCase().includes(normalizedSearch)
    )
  )

  const siswaToShow = searchActive ? filteredSiswa : siswaList

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Kelas Wali Saya</h1>
        <p className="text-gray-600">
          {searchActive ? `Hasil pencarian untuk "${searchQuery}"` : 'Data siswa dalam kelas yang Anda dampingi'}
        </p>
      </div>

      {/* Kelas Card */}
      <div className="mb-8 grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-black">{waliClassName || 'Belum ditetapkan'}</h2>
              <p className="text-gray-600 text-sm mt-1">Kelas Wali</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Siswa</p>
              <p className="text-2xl font-bold text-blue-600">{siswaList.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Daftar Siswa */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-black">Daftar Siswa {waliClassName || ''}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">No. Urut</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nama Siswa</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">NIS</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nilai Rata-rata</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {siswaToShow.length > 0 ? (
                siswaToShow.map((siswa: any, idx: number) => (
                <tr key={siswa.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">{idx + 1}</td>
                  <td className="px-6 py-4 font-medium text-black">{siswa.nama}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{siswa.nis || ''}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded font-semibold text-sm">
                      {siswa.rataRataNilai}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">{siswa.status === 'baik' ? 'Aktif' : siswa.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/guru/wali-kelas/${siswa.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Lihat Detail →</Link>
                  </td>
                </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Users size={48} className="text-gray-400 mb-4" />
                      <p className="text-gray-600 text-lg">{searchActive ? 'Tidak ada siswa yang sesuai dengan pencarian' : 'Belum ada siswa'}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
