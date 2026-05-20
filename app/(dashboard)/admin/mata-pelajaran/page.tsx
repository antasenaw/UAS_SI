'use client'

import { useMemo, useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, BookOpen, Link } from 'lucide-react'
import { useSearch } from '@/app/providers'

export default function AdminMataPelajaranPage() {
  const [subjects, setSubjects] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [classSubjects, setClassSubjects] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const [showSubjectModal, setShowSubjectModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentSubject, setCurrentSubject] = useState<any>({})
  const [assignment, setAssignment] = useState<any>({})
  const [modalLoading, setModalLoading] = useState(false)

  const [filterKategori, setFilterKategori] = useState<'all' | 'Umum' | 'Peminatan'>('all')
  const { searchQuery } = useSearch()
  const normalizedSearch = searchQuery.trim().toLowerCase()
  const searchActive = normalizedSearch.length > 0

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [resSub, resCla, resTea, resClassSubjects] = await Promise.all([
        fetch('/api/subject'),
        fetch('/api/class'),
        fetch('/api/user?role=Guru'),
        fetch('/api/class-subject')
      ])
      const dataSub = await resSub.json()
      const dataCla = await resCla.json()
      const dataTea = await resTea.json()
      const dataClassSubjects = await resClassSubjects.json()
      
      if (!dataSub.success) throw new Error(dataSub.error || 'Gagal memuat mata pelajaran')
      if (!dataClassSubjects.success) throw new Error(dataClassSubjects.error || 'Gagal memuat penugasan kelas')
      
      setSubjects(dataSub.data)
      if (dataCla.success) setClasses(dataCla.data)
      if (dataTea.success) setTeachers(dataTea.data)
      setClassSubjects(dataClassSubjects.data)
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleOpenAddSubject = () => {
    setCurrentSubject({ kategori: 'Umum', status: 'Aktif', jurusan: 'Semua' })
    setIsEditing(false)
    setShowSubjectModal(true)
  }

  const handleOpenEditSubject = (sub: any) => {
    setCurrentSubject(sub)
    setIsEditing(true)
    setShowSubjectModal(true)
  }

  const handleOpenAssign = (sub: any) => {
    setAssignment({ subjectId: sub._id, hari: 'Senin', jamMulai: '07:00', jamSelesai: '09:00', ruangKelas: 'R.01' })
    setShowAssignModal(true)
  }

  const handleDeleteSubject = async (id: string) => {
    if (!confirm('Hapus mata pelajaran ini?')) return
    try {
      await fetch(`/api/subject?id=${id}`, { method: 'DELETE' })
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setModalLoading(true)
    try {
      const url = isEditing ? `/api/subject?id=${currentSubject._id}` : '/api/subject'
      const method = isEditing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentSubject)
      })
      if (res.ok) {
        setShowSubjectModal(false)
        fetchData()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setModalLoading(false)
    }
  }

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setModalLoading(true)
    try {
      const res = await fetch('/api/class-subject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignment)
      })
      if (res.ok) {
        setShowAssignModal(false)
        await fetchData()
        alert('Mata pelajaran berhasil ditugaskan ke kelas!')
      } else {
        const err = await res.json()
        alert(err.error)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setModalLoading(false)
    }
  }

  const handleDeleteAssignment = async (id: string) => {
    if (!confirm('Hapus penugasan mata pelajaran untuk kelas ini?')) return
    try {
      const res = await fetch(`/api/class-subject?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchData()
      } else {
        const err = await res.json()
        alert(err.error)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filteredMapel = subjects.filter((mapel) => {
    const matchesKategori = filterKategori === 'all' || mapel.kategori === filterKategori
    const matchesSearch = normalizedSearch === '' ||
      mapel.namaMataPelajaran?.toLowerCase().includes(normalizedSearch) ||
      mapel.kode?.toLowerCase().includes(normalizedSearch)
    return matchesKategori && matchesSearch
  })

  if (loading) return <div className="p-8 text-center text-black font-medium">Memuat data...</div>

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Manajemen Mata Pelajaran</h1>
          <p className="text-gray-600">Kelola kurikulum dan penugasan guru</p>
        </div>
        <button onClick={handleOpenAddSubject} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          <Plus size={20} /> Tambah Mapel
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Mata Pelajaran</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Kode</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Kategori</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Guru Pengampu</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredMapel.map((mapel) => (
                <tr key={mapel._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-black">{mapel.namaMataPelajaran}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{mapel.kode}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${mapel.kategori === 'Umum' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>
                      {mapel.kategori}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-black">{mapel.pengampu?.name || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleOpenAssign(mapel)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Link size={18} /></button>
                      <button onClick={() => handleOpenEditSubject(mapel)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><Edit2 size={18} /></button>
                      <button onClick={() => handleDeleteSubject(mapel._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-bold text-black">Penugasan Mata Pelajaran per Kelas</h2>
          <p className="text-sm text-gray-500">Setiap kelas dapat memiliki pengampu berbeda untuk mata pelajaran yang sama.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Kelas</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Mata Pelajaran</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Guru</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Hari / Jam</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Ruang</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {classSubjects.map((cs) => (
                <tr key={cs._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-black">{`${cs.classId?.angkatan || '-'} ${cs.classId?.jurusan || ''} ${cs.classId?.namaKelas || ''}`.trim()}</td>
                  <td className="px-6 py-4 text-sm text-black">{cs.subjectId?.namaMataPelajaran || '-'}</td>
                  <td className="px-6 py-4 text-sm text-black">{cs.guruPengajar?.name || '-'}</td>
                  <td className="px-6 py-4 text-sm text-black">{`${cs.hari || '-'} ${cs.jamMulai || ''}-${cs.jamSelesai || ''}`}</td>
                  <td className="px-6 py-4 text-sm text-black">{cs.ruangKelas || '-'}</td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => handleDeleteAssignment(cs._id)} className="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-100">Hapus</button>
                  </td>
                </tr>
              ))}
              {classSubjects.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Belum ada penugasan kelas untuk mata pelajaran.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showSubjectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-blue-600 px-6 py-4 flex items-center justify-between text-white">
              <h2 className="text-xl font-bold">{isEditing ? 'Edit Mapel' : 'Tambah Mapel'}</h2>
              <button onClick={() => setShowSubjectModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubjectSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Mata Pelajaran</label>
                <input required type="text" value={currentSubject.namaMataPelajaran || ''} onChange={(e) => setCurrentSubject({ ...currentSubject, namaMataPelajaran: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-black" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kode</label>
                <input required type="text" value={currentSubject.kode || ''} onChange={(e) => setCurrentSubject({ ...currentSubject, kode: e.target.value.toUpperCase() })} className="w-full px-4 py-2 border rounded-lg text-black" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kategori</label>
                <select value={currentSubject.kategori || 'Umum'} onChange={(e) => setCurrentSubject({ ...currentSubject, kategori: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-black">
                  <option value="Umum">Umum</option>
                  <option value="Peminatan">Peminatan</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Jurusan</label>
                <input required type="text" value={currentSubject.jurusan || ''} onChange={(e) => setCurrentSubject({...currentSubject, jurusan: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-black" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Guru Pengampu</label>
                <select required value={currentSubject.pengampu?._id || currentSubject.pengampu || ''} onChange={(e) => setCurrentSubject({...currentSubject, pengampu: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-black">
                  <option value="">Pilih Guru</option>
                  {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                <button type="button" onClick={() => setShowSubjectModal(false)} className="px-6 py-2 text-gray-600 font-bold">Batal</button>
                <button type="submit" disabled={modalLoading} className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50">
                  {modalLoading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between text-white">
              <h2 className="text-xl font-bold">Tugaskan ke Kelas</h2>
              <button onClick={() => setShowAssignModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAssignSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kelas</label>
                <select required onChange={(e) => setAssignment({ ...assignment, classId: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-black">
                  <option value="">Pilih Kelas</option>
                  {classes.map(c => <option key={c._id} value={c._id}>{c.angkatan} {c.jurusan} {c.namaKelas}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Guru Pengampu</label>
                <select required onChange={(e) => setAssignment({ ...assignment, guruPengajar: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-black">
                  <option value="">Pilih Guru</option>
                  {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hari</label>
                  <select value={assignment.hari} onChange={(e) => setAssignment({ ...assignment, hari: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-black">
                    {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ruang</label>
                  <input type="text" value={assignment.ruangKelas} onChange={(e) => setAssignment({ ...assignment, ruangKelas: e.target.value })} className="w-full px-4 py-2 border rounded-lg text-black" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                <button type="button" onClick={() => setShowAssignModal(false)} className="px-6 py-2 text-gray-600 font-bold">Batal</button>
                <button type="submit" disabled={modalLoading} className="px-8 py-2 bg-indigo-600 text-white rounded-xl font-bold disabled:opacity-50">
                  {modalLoading ? 'Menyimpan...' : 'Tugaskan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
