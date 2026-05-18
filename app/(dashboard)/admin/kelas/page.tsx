'use client'

import { useState, useEffect } from 'react'
import { useSearch } from '@/app/providers'
import { Plus, Edit2, Trash2, Users, UserCheck } from 'lucide-react'

export default function AdminKelasPage() {
  const [kelasList, setKelasList] = useState<any[]>([])
  const [gurus, setGurus] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentKelas, setCurrentKelas] = useState<any>({})
  const [modalLoading, setModalLoading] = useState(false)

  const { searchQuery } = useSearch()
  const normalizedSearch = searchQuery.toLowerCase().trim()
  const searchActive = normalizedSearch.length > 0

  const [enrollments, setEnrollments] = useState<any[]>([])
  const [allSiswa, setAllSiswa] = useState<any[]>([])
  const [activePeriod, setActivePeriod] = useState<any>(null)
  const [showSiswaModal, setShowSiswaModal] = useState(false)
  const [selectedKelasId, setSelectedKelasId] = useState<string | null>(null)

  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [resKelas, resGurus, resSiswa, resPeriod] = await Promise.all([
        fetch('/api/class'),
        fetch('/api/user?role=Guru'),
        fetch('/api/user?role=Siswa'),
        fetch('/api/period?active=true')
      ])
      
      if (!resKelas.ok || !resGurus.ok || !resSiswa.ok || !resPeriod.ok) {
        throw new Error('Salah satu API gagal merespon')
      }

      const dataKelas = await resKelas.json()
      const dataGurus = await resGurus.json()
      const dataSiswa = await resSiswa.json()
      const dataPeriod = await resPeriod.json()
      
      if (dataKelas.success) setKelasList(dataKelas.data)
      if (dataGurus.success) setGurus(dataGurus.data)
      if (dataSiswa.success) setAllSiswa(dataSiswa.data)
      if (dataPeriod.success) setActivePeriod(dataPeriod.data)
    } catch (err: any) {
      console.error('Fetch error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenSiswa = async (kelasId: string) => {
    setSelectedKelasId(kelasId)
    setShowSiswaModal(true)
    const res = await fetch(`/api/enrollment?classId=${kelasId}`)
    const data = await res.json()
    if (data.success) setEnrollments(data.data)
  }

  const handleAddSiswa = async (siswaId: string) => {
    try {
      const res = await fetch('/api/enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedKelasId,
          studentId: siswaId,
        })
      })
      const data = await res.json()
      if (data.success) {
        handleOpenSiswa(selectedKelasId!)
        fetchData()
      } else {
        alert(data.error)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleRemoveSiswa = async (enrollmentId: string) => {
    if (!confirm('Keluarkan siswa dari kelas?')) return
    try {
      await fetch(`/api/enrollment?id=${enrollmentId}`, { method: 'DELETE' })
      handleOpenSiswa(selectedKelasId!)
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleOpenAdd = () => {
    setCurrentKelas({ angkatan: '2024', jurusan: 'IPA', namaKelas: '', kapasitas: 36, status: 'Aktif' })
    setIsEditing(false)
    setShowModal(true)
  }

  const handleOpenEdit = (kelas: any) => {
    setCurrentKelas({
      ...kelas,
      waliKelas: kelas.waliKelas?._id || kelas.waliKelas
    })
    setIsEditing(true)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus kelas ini?')) return
    try {
      await fetch(`/api/class?id=${id}`, { method: 'DELETE' })
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setModalLoading(true)
    try {
      const url = isEditing ? `/api/class?id=${currentKelas._id}` : '/api/class'
      const method = isEditing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentKelas)
      })
      if (res.ok) {
        setShowModal(false)
        fetchData()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setModalLoading(false)
    }
  }

  const filteredKelas = kelasList.filter((kelas) =>
    [`${kelas.angkatan} ${kelas.jurusan} ${kelas.namaKelas}`, kelas.waliKelas?.name].some((value) =>
      value?.toLowerCase().includes(normalizedSearch)
    )
  )

  const kelasToShow = searchActive ? filteredKelas : kelasList

  if (loading) return <div className="p-8 text-center text-black font-medium">Memuat data akademik...</div>

  if (error) return (
    <div className="p-8 text-center">
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl inline-block">
        <p className="font-bold">Gagal memuat data</p>
        <p className="text-sm">{error}</p>
        <button onClick={fetchData} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm">Coba Lagi</button>
      </div>
    </div>
  )

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Manajemen Kelas</h1>
          <p className="text-gray-600">
            {searchActive ? `Hasil pencarian untuk "${searchQuery}"` : 'Kelola data kelas dan wali kelas'}
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md transition-all"
        >
          <Plus size={20} />
          Tambah Kelas Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kelasToShow.length > 0 ? (
          kelasToShow.map((kelas) => (
            <div key={kelas._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 flex gap-2 translate-y-[-100%] group-hover:translate-y-0 transition-transform bg-white/80 backdrop-blur-sm rounded-bl-xl border-l border-b">
                <button onClick={() => handleOpenEdit(kelas)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(kelas._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="mb-4">
                <h3 className="text-2xl font-bold text-black">{kelas.angkatan} {kelas.jurusan} {kelas.namaKelas}</h3>
                <div className="flex items-center gap-2 mt-2 text-blue-600 font-medium text-sm">
                  <UserCheck size={16} />
                  <span>Wali: {kelas.waliKelas?.name || 'Belum diatur'}</span>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users size={18} className="text-gray-400" />
                    <span className="font-semibold text-black">{kelas.jumlahSiswa} / {kelas.kapasitas}</span>
                  </div>
                  <button onClick={() => handleOpenSiswa(kelas._id)} className="text-xs font-bold text-blue-600 hover:underline">
                    Kelola Siswa
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <Users size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg font-medium">Belum ada data kelas</p>
          </div>
        )}
      </div>

      {showSiswaModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="bg-blue-600 px-6 py-4 flex items-center justify-between text-white">
              <h2 className="text-xl font-bold">Manajemen Siswa Kelas</h2>
              <button onClick={() => setShowSiswaModal(false)}>✕</button>
            </div>
            <div className="p-6 overflow-y-auto flex-grow grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-black mb-4">Siswa Terdaftar ({enrollments.length})</h3>
                <div className="space-y-2">
                  {enrollments.map((en: any) => (
                    <div key={en._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div>
                        <p className="font-bold text-black text-sm">{en.studentId?.name}</p>
                        <p className="text-xs text-gray-500">NIS: {en.studentId?.noInduk}</p>
                      </div>
                      <button onClick={() => handleRemoveSiswa(en._id)} className="text-red-500 p-1"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-l pl-8">
                <h3 className="font-bold text-black mb-4">Tambah Siswa</h3>
                <div className="space-y-2 max-h-[400px] overflow-auto">
                  {allSiswa.filter(s => !enrollments.some(en => en.studentId?._id === s._id)).map((s: any) => (
                    <div key={s._id} className="flex items-center justify-between p-3 hover:bg-gray-50 border rounded-lg group">
                      <div>
                        <p className="font-bold text-black text-sm">{s.name}</p>
                        <p className="text-xs text-gray-500">NIS: {s.noInduk}</p>
                      </div>
                      <button onClick={() => handleAddSiswa(s._id)} className="bg-blue-600 text-white text-xs px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 font-bold">Tambah</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit Kelas' : 'Tambah Kelas Baru'}</h2>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Angkatan</label>
                  <input required type="text" value={currentKelas.angkatan || ''} onChange={(e) => setCurrentKelas({...currentKelas, angkatan: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-black" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Jurusan</label>
                  <select value={currentKelas.jurusan || 'IPA'} onChange={(e) => setCurrentKelas({...currentKelas, jurusan: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-black">
                    <option value="IPA">IPA</option>
                    <option value="IPS">IPS</option>
                    <option value="BAHASA">BAHASA</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Kelas (Contoh: A, B, C)</label>
                <input required type="text" value={currentKelas.namaKelas || ''} onChange={(e) => setCurrentKelas({...currentKelas, namaKelas: e.target.value.toUpperCase()})} className="w-full px-4 py-2 border rounded-lg text-black" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kapasitas</label>
                <input type="number" value={currentKelas.kapasitas || 36} onChange={(e) => setCurrentKelas({...currentKelas, kapasitas: parseInt(e.target.value)})} className="w-full px-4 py-2 border rounded-lg text-black" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Wali Kelas</label>
                <select required value={currentKelas.waliKelas || ''} onChange={(e) => setCurrentKelas({ ...currentKelas, waliKelas: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-black">
                  <option value="">Pilih Wali Kelas</option>
                  {gurus.map(guru => <option key={guru._id} value={guru._id}>{guru.name}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-bold">Batal</button>
                <button type="submit" disabled={modalLoading} className="px-8 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold disabled:opacity-50">
                  {modalLoading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
