'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, FileText, CheckCircle, Clock, Save } from 'lucide-react'
import { useAuth } from '@/lib/auth/context'

interface SubmissionFile {
  nama: string
  ukuran?: string
  tipe?: string
  url?: string
}

interface SubmissionDetail {
  id: string
  studentId: string
  studentName: string
  studentNoInduk?: string
  status: 'Draft' | 'Submitted' | 'Graded'
  files: SubmissionFile[]
  tanggalSubmit: string
  nilai?: number
  gradeId?: string
}

interface AssignmentDetail {
  id: string
  judul: string
  deskripsi: string
  deadline: string
  mataPelajaran: {
    id: string
    namaMataPelajaran: string
  }
  classId: string
  className: string
}

function getLetterGrade(nilai: number) {
  if (nilai >= 85) return 'A'
  if (nilai >= 70) return 'B'
  if (nilai >= 55) return 'C'
  if (nilai >= 40) return 'D'
  return 'E'
}

export default function GuruPekerjaanDetailPage() {
  const params = useParams() as { id?: string; pekerjaaanId?: string }
  const classId = params.id
  const assignmentId = params.pekerjaaanId
  const { user } = useAuth()

  const [assignment, setAssignment] = useState<AssignmentDetail | null>(null)
  const [submissions, setSubmissions] = useState<SubmissionDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [nilaiEdit, setNilaiEdit] = useState<Record<string, number>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const authHeaders = useMemo(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token) headers.Authorization = `Bearer ${token}`
    return headers
  }, [user])

  const fetchAssignmentData = async () => {
    if (!assignmentId) return

    setLoading(true)
    setError(null)

    try {
      const [assignmentRes, submissionsRes] = await Promise.all([
        fetch(`/api/assignment?id=${assignmentId}`, { headers: authHeaders }),
        fetch(`/api/submission?assignmentId=${assignmentId}`, { headers: authHeaders }),
      ])

      if (!assignmentRes.ok) throw new Error('Gagal memuat tugas')
      if (!submissionsRes.ok) throw new Error('Gagal memuat pengumpulan siswa')

      const assignmentJson = await assignmentRes.json()
      const submissionsJson = await submissionsRes.json()
      const assignmentData = assignmentJson.data?.[0]
      if (!assignmentData) throw new Error('Tugas tidak ditemukan')

      const assignmentDetail: AssignmentDetail = {
        id: assignmentData._id,
        judul: assignmentData.judul,
        deskripsi: assignmentData.deskripsi,
        deadline: new Date(assignmentData.deadline).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
        mataPelajaran: {
          id: assignmentData.mataPelajaran?._id || assignmentData.mataPelajaran,
          namaMataPelajaran: assignmentData.mataPelajaran?.namaMataPelajaran || 'Mata pelajaran tidak tersedia',
        },
        classId: assignmentData.classId?._id || assignmentData.classId,
        className: assignmentData.classId?.namaKelas || 'Kelas',
      }

      const submissionsData = submissionsJson.data || []
      const parsedSubmissions = submissionsData.map((item: any) => {
        // support both legacy `file` string and new `files` array
        let files: SubmissionFile[] = []
        if (Array.isArray(item.files) && item.files.length > 0) {
          files = item.files.map((f: any) => {
            const fileName = f.nama || 'file'
            // Extract just the safe filename from full path if needed
            const urlFileName = f.url ? f.url.split('/').pop() : fileName
            return {
              nama: fileName,
              ukuran: f.ukuran ? `${(parseInt(f.ukuran) / 1024).toFixed(2)} KB` : '-',
              tipe: f.tipe || '',
              url: `/api/submission/download?file=${encodeURIComponent(urlFileName)}`
            }
          })
        } else if (typeof item.file === 'string' && item.file.trim()) {
          const names = String(item.file).split(';').filter(Boolean)
          files = names.map((n: string) => ({ nama: n, ukuran: '-', tipe: 'FILE', url: '#' }))
        }

        return {
          id: item._id,
          studentId: item.studentId?._id || item.studentId,
          studentName: item.studentId?.name || 'Tanpa Nama',
          studentNoInduk: item.studentId?.noInduk,
          status: item.status,
          files,
          tanggalSubmit: item.tanggalSubmit ? new Date(item.tanggalSubmit).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }) : '-',
          nilai: undefined,
        }
      })

      setAssignment(assignmentDetail)
      setSubmissions(parsedSubmissions)
      setNilaiEdit(
        parsedSubmissions.reduce((acc: Record<string, number>, submission: SubmissionDetail) => {
          if (submission.nilai !== undefined) acc[submission.id] = submission.nilai
          return acc
        }, {})
      )
    } catch (err) {
      if (err instanceof Error) setError(err.message)
      else setError('Terjadi kesalahan saat memuat data tugas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssignmentData()
  }, [assignmentId])

  const handleNilaiChange = (submissionId: string, nilai: number) => {
    setNilaiEdit((prev) => ({ ...prev, [submissionId]: nilai }))
  }

  const handleSimpanNilai = async (submission: SubmissionDetail) => {
    if (!user?._id) {
      setError('Login sebagai guru diperlukan untuk memberi nilai.')
      return
    }

    const nilai = nilaiEdit[submission.id]
    if (nilai === undefined || nilai < 0 || nilai > 100) {
      setError('Masukkan nilai antara 0 sampai 100 sebelum menyimpan.')
      return
    }

    if (!assignment) {
      setError('Data tugas tidak lengkap.')
      return
    }

    setSavingId(submission.id)
    setSuccessMessage(null)
    setError(null)

    try {
      const gradePayload = {
        studentId: submission.studentId,
        subjectId: assignment.mataPelajaran.id,
        classId: assignment.classId,
        teacherId: user._id,
        nilai,
        grade: getLetterGrade(nilai),
      }

      const gradeRes = await fetch('/api/grade', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(gradePayload),
      })

      if (!gradeRes.ok) {
        const body = await gradeRes.json()
        throw new Error(body.error || 'Gagal menyimpan nilai siswa')
      }

      await fetch('/api/submission', {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ id: submission.id, status: 'Graded' }),
      })

      setSuccessMessage(`Nilai ${submission.studentName} berhasil disimpan.`)
      setSubmissions((prev) =>
        prev.map((item) =>
          item.id === submission.id ? { ...item, status: 'Graded', nilai } : item
        )
      )
    } catch (err) {
      if (err instanceof Error) setError(err.message)
      else setError('Terjadi kesalahan saat menyimpan nilai')
    } finally {
      setSavingId(null)
    }
  }

  const totalStudents = submissions.length
  const submittedCount = submissions.filter((item) => item.status === 'Submitted' || item.status === 'Graded').length
  const pendingCount = totalStudents - submittedCount

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md border border-red-100 p-8">
          <h1 className="text-2xl font-bold text-red-700 mb-4">Gagal memuat tugas</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <Link href={`/guru/kelas/${classId}`} className="text-blue-600 hover:underline">
            Kembali ke Detail Kelas
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link
          href={`/guru/kelas/${classId}`}
          className="flex items-center gap-2 mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          <ArrowLeft size={18} />
          Kembali ke Detail Kelas
        </Link>
        <h1 className="text-3xl font-bold text-black">{assignment?.judul}</h1>
        <p className="text-gray-600 mt-1">Kelola pengumpulan dan nilai siswa</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.8fr_1fr] gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-500">Mata Pelajaran</p>
            <p className="text-lg font-semibold text-black">{assignment?.mataPelajaran.namaMataPelajaran}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-500">Deadline</p>
            <p className="text-lg font-semibold text-black">{assignment?.deadline}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Deskripsi</p>
            <p className="text-base text-gray-700 mt-2 whitespace-pre-line">{assignment?.deskripsi || '-'}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-500">Total Pengumpulan</p>
            <p className="text-3xl font-bold text-black mt-2">{totalStudents}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-500">Sudah Submit</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{submittedCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-500">Belum Submit</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{pendingCount}</p>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="mb-4 rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-black">Daftar Siswa yang Mengumpulkan</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Nama Siswa</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">File / Tanggal</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Nilai</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-gray-500">
                    Belum ada pengumpulan siswa untuk tugas ini.
                  </td>
                </tr>
              ) : (
                submissions.map((submission) => {
                  const isSubmitted = submission.status === 'Submitted' || submission.status === 'Graded'
                  const currentNilai = nilaiEdit[submission.id]

                  return (
                    <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-black">
                        {submission.studentName}
                        <p className="text-xs text-gray-500 mt-1">{submission.studentNoInduk || ''}</p>
                      </td>
                      <td className="px-6 py-4">
                        {isSubmitted ? (
                          <div className="flex items-center gap-2 text-green-700">
                            <CheckCircle size={16} />
                            <span className="text-sm font-medium">Sudah Dikumpulkan</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-red-700">
                            <Clock size={16} />
                            <span className="text-sm font-medium">Belum Dikumpulkan</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isSubmitted ? (
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">{submission.tanggalSubmit}</p>
                            {submission.files && submission.files.length > 0 ? (
                              <div className="space-y-2">
                                {submission.files.map((f) => (
                                  <a
                                    key={f.nama + f.url}
                                    href={f.url || '#'}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm text-blue-600 hover:underline flex items-center gap-2"
                                  >
                                    <FileText size={14} />
                                    <span>{f.nama}</span>
                                    {f.ukuran && <span className="text-xs text-gray-500">({f.ukuran})</span>}
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">Tidak ada file terlampir</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">-</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isSubmitted ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              className="w-20 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              value={currentNilai ?? ''}
                              onChange={(e) => handleNilaiChange(submission.id, parseInt(e.target.value, 10) || 0)}
                            />
                            <span className="text-sm text-gray-600">/ 100</span>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">-</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isSubmitted ? (
                          <button
                            onClick={() => handleSimpanNilai(submission)}
                            disabled={savingId === submission.id}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
                          >
                            <Save size={14} />
                            {savingId === submission.id ? 'Menyimpan...' : 'Simpan'}
                          </button>
                        ) : (
                          <span className="text-sm text-gray-500">Tidak bisa dinilai</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
