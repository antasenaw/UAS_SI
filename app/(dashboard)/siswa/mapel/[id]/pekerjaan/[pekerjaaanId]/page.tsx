'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/lib/auth/context'
import { ArrowLeft, FileText, Download, Upload, X, CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface SubmissionFile {
  nama: string
  ukuran: string
  tipe: string
  url: string
}

interface Submission {
  id: string
  file: SubmissionFile[]
  submittedAt: string
  status: 'tepat_waktu' | 'terlambat'
}

export default function PekerjaanDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const mapelId = params.id as string
  const pekerjaaanId = params.pekerjaaanId as string
  
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pekerjaan, setPekerjaan] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const authHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
    const headers: Record<string, string> = {}
    if (token) {
      headers.Authorization = 'Bearer ' + token
    }
    return headers
  }

  useEffect(() => {
    const fetchAssignmentAndSubmission = async () => {
      try {
        const [assignmentRes, submissionRes] = await Promise.all([
          fetch(`/api/assignment?id=${pekerjaaanId}`, { headers: authHeaders() }),
          fetch(`/api/submission?assignmentId=${pekerjaaanId}&studentId=${user?._id || ''}`, { headers: authHeaders() })
        ])

        const assignmentJson = await assignmentRes.json()
        if (assignmentJson.success && assignmentJson.data && assignmentJson.data.length > 0) {
          setPekerjaan(assignmentJson.data[0])
        }

        const submissionJson = await submissionRes.json()
        if (submissionJson.success && submissionJson.data && submissionJson.data.length > 0) {
          const existing = submissionJson.data[0]
          const fileNames = String(existing.file || '').split(';').filter(Boolean)
          const deadline = assignmentJson.data?.[0]?.deadline ? new Date(assignmentJson.data[0].deadline) : new Date()
          setSubmission({
            id: existing._id,
            file: fileNames.map((name: string) => ({ nama: name, ukuran: '-', tipe: 'FILE', url: '#' })),
            submittedAt: existing.tanggalSubmit,
            status: new Date(existing.tanggalSubmit) <= deadline ? 'tepat_waktu' : 'terlambat'
          })
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (pekerjaaanId && user?._id) {
      fetchAssignmentAndSubmission()
    }
  }, [pekerjaaanId, user?._id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!pekerjaan) {
    return <div className="text-center py-16">Pekerjaan tidak ditemukan</div>
  }

  const deadlineDate = new Date(pekerjaan.deadline)
  const currentDate = new Date()
  const isOverdue = currentDate > deadlineDate
  const currentSubmission = submission || pekerjaan.submission || null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isOverdue && !currentSubmission) return
    const files = e.target.files
    if (files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(files)])
    }
  }

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (uploadedFiles.length === 0 || isOverdue || !user?._id) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('assignmentId', pekerjaaanId)
      formData.append('studentId', user._id)
      formData.append('tanggalSubmit', new Date().toISOString())
      formData.append('status', 'Submitted')
      uploadedFiles.forEach((file) => {
        formData.append('file', file)
      })

      const res = await fetch('/api/submission', {
        method: 'POST',
        headers: authHeaders(),
        body: formData,
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal mengirimkan tugas')
      }

      setSubmission({
        id: data.data._id,
        file: data.data.files || uploadedFiles.map((file) => ({
          nama: file.name,
          ukuran: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          tipe: file.type.split('/')[1].toUpperCase() || 'FILE',
          url: '#',
        })),
        submittedAt: new Date().toISOString(),
        status: isOverdue ? 'terlambat' : 'tepat_waktu',
      })
      setUploadedFiles([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Upload gagal:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleUndoSubmission = () => {
    setSubmission(null)
    setUploadedFiles([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col h-screen">
    

      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header - Judul dan Deadline */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <Link
              href={`/siswa/mapel/${mapelId}`}
              className="flex items-center gap-2 mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <ArrowLeft size={18} />
              Kembali
            </Link>
            <div>
              <h1 className="text-3xl font-semibold text-black">{pekerjaan.judul || pekerjaan.nama}</h1>
              <p className="text-gray-600 text-sm mt-2 flex items-center gap-2">
                <Clock size={16} />
                Deadline: {deadlineDate.toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })} pukul 23:59
              </p>
            </div>
          </div>
        </div>

        {/* Content - Dua Kolom */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-3 gap-8">
            {/* Kolom Kiri - Deskripsi & Lampiran (2 kolom) */}
            <div className="col-span-2 space-y-6">
              {/* Deskripsi Pekerjaan */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-xl font-semibold text-black mb-4">Deskripsi Pekerjaan</h2>
                <div className="text-gray-700 leading-relaxed space-y-4 whitespace-pre-wrap">
                  {pekerjaan.deskripsi}
                </div>
              </div>

              {/* File Lampiran */}
              {pekerjaan.file && Array.isArray(pekerjaan.file) && pekerjaan.file.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-xl font-semibold text-black mb-6">File Lampiran Pekerjaan</h2>
                  <div className="space-y-3">
                    {pekerjaan.file.map((file: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <FileText className="text-gray-600" size={24} />
                          <div>
                            <p className="font-medium text-black">{file.nama}</p>
                            <p className="text-xs text-gray-500">
                              {file.tipe} • {file.ukuran}
                            </p>
                          </div>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                          <Download size={18} />
                          <span className="text-sm font-medium">Download</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Kolom Kanan - Upload Section (1 kolom) */}
            <div className="col-span-1">
              <div className="sticky top-24 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-black mb-6">Pengumpulan Pekerjaan</h2>

                {/* Submission yang Sudah Ada */}
                {currentSubmission && (
                  <div className="mb-6 pb-6 border-b space-y-4">
                    <div className={`p-4 rounded-lg border ${
                      currentSubmission.status === 'tepat_waktu' 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-yellow-50 border-yellow-200'
                    }`}>
                      <div className={`flex items-center gap-2 font-medium mb-2 ${
                        currentSubmission.status === 'tepat_waktu' 
                          ? 'text-green-700' 
                          : 'text-yellow-700'
                      }`}>
                        <CheckCircle size={18} />
                        {currentSubmission.status === 'tepat_waktu' ? 'Diserahkan (Tepat Waktu)' : 'Diserahkan (Terlambat)'}
                      </div>
                      <p className="text-xs text-gray-600">
                        {new Date(currentSubmission.submittedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    {/* File yang Dikumpulkan */}
                    <div>
                      <p className="text-sm font-medium text-black mb-3">File Pengumpulan ({currentSubmission.file.length})</p>
                      <div className="space-y-2">
                        {currentSubmission.file.map((file: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText className="text-gray-600 shrink-0" size={18} />
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-black truncate">{file.nama}</p>
                                <p className="text-xs text-gray-500">{file.ukuran}</p>
                              </div>
                            </div>
                            <button className="text-blue-600 hover:text-blue-800 p-2 shrink-0">
                              <Download size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tombol Batalkan - Hanya jika deadline belum lewat */}
                    {!isOverdue && (
                      <button
                        onClick={handleUndoSubmission}
                        className="w-full px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                      >
                        Batalkan Pengumpulan
                      </button>
                    )}
                  </div>
                )}

                {/* Status Terlambat - Jika belum submit dan deadline lewat */}
                {!currentSubmission && isOverdue && (
                  <div className="mb-6 pb-6 border-b">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                      <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-red-700 mb-1">Pengumpulan Terlambat</p>
                        <p className="text-xs text-red-600">Deadline telah berlalu. Anda tidak dapat mengumpulkan tugas.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Area Upload - Hanya jika belum submit */}
                {!currentSubmission && (
                  <div className={`space-y-4 ${isOverdue ? 'opacity-60 pointer-events-none' : ''}`}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.zip"
                      multiple
                      disabled={isOverdue}
                    />

                    {uploadedFiles.length > 0 ? (
                      // File Sudah Dipilih
                      <div className="space-y-4">
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-700 font-medium mb-3">File Dipilih ({uploadedFiles.length}):</p>
                          <div className="space-y-2">
                            {uploadedFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-white border border-blue-200 rounded">
                                <div className="flex items-center gap-2 min-w-0">
                                  <FileText className="text-gray-600 shrink-0" size={16} />
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-black truncate">{file.name}</p>
                                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleRemoveFile(index)}
                                  className="text-red-600 hover:text-red-800 p-1 shrink-0"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                          Tambah File Lagi
                        </button>

                        <div className="space-y-2">
                          <button
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:bg-gray-400 flex items-center justify-center gap-2"
                          >
                            {isUploading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-green-600"></div>
                                Mengirim...
                              </>
                            ) : (
                              <>
                                <Upload size={16} />
                                Kirim Pekerjaan
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => setUploadedFiles([])}
                            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                          >
                            Hapus Semua
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Area Upload Kosong
                      <div>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isOverdue}
                          className="w-full disabled:cursor-not-allowed"
                        >
                          <div className={`p-8 border-2 border-dashed rounded-lg text-center transition-colors ${
                            isOverdue 
                              ? 'border-gray-300 bg-gray-50' 
                              : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                          }`}>
                            <Upload className={`mx-auto mb-3 ${isOverdue ? 'text-gray-300' : 'text-gray-400'}`} size={32} />
                            <p className={`text-sm font-medium mb-1 ${isOverdue ? 'text-gray-400' : 'text-gray-700'}`}>
                              Pilih atau Drag File di sini
                            </p>
                            <p className={`text-xs ${isOverdue ? 'text-gray-400' : 'text-gray-500'}`}>
                              PDF, DOC, DOCX, XLS, XLSX, PPT, JPG, PNG (Max 25MB)
                            </p>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
