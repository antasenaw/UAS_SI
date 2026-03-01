'use client'

import { User, Hash, Users, BookOpen } from 'lucide-react'

interface GuruProfileCardProps {
  nama?: string
  nip?: string
  kelasWali?: string
  mataPelajaran?: string[]
}

export default function GuruProfileCard({
  nama = 'Ibu Siti Nurhaliza, S.Pd',
  nip = '197503051998032001',
  kelasWali = 'XII MIPA 4',
  mataPelajaran = ['Matematika', 'Fisika']
}: GuruProfileCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header Background */}
      <div className="h-24 bg-linear-to-r from-blue-500 to-blue-600"></div>

      {/* Content */}
      <div className="p-6 -mt-16 relative">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-blue-100 border-4 border-white flex items-center justify-center mb-4 shadow-md">
          <User size={40} className="text-blue-600" />
        </div>

        {/* Info */}
        <h2 className="text-xl font-bold text-black mb-1">{nama}</h2>
        
        <div className="space-y-3 mt-4 pt-4 border-t border-gray-100">
          {/* NIP */}
          <div className="flex items-start gap-3">
            <Hash size={18} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Nomor Induk Pegawai</p>
              <p className="text-sm font-semibold text-black">{nip}</p>
            </div>
          </div>

          {/* Kelas Wali */}
          <div className="flex items-start gap-3">
            <Users size={18} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Kelas yang Diwali</p>
              <p className="text-sm font-semibold text-black">{kelasWali}</p>
            </div>
          </div>

          {/* Mata Pelajaran */}
          <div className="flex items-start gap-3">
            <BookOpen size={18} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Mata Pelajaran</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {mataPelajaran.map((mapel, idx) => (
                  <span key={idx} className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                    {mapel}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
