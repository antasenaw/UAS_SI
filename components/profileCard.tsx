interface ProfileCardProps {
  nama?: string
  nis?: string
  kelas?: string
  noAbsen?: string
  tahunMasuk?: string
  waliKelas?: string
  fotoUrl?: string
}

export default function ProfileCard({
  nama = 'Yogi Nugraha',
  nis = '247006111067',
  kelas = 'XII MIPA 4',
  noAbsen = '12',
  tahunMasuk = '2023/2024',
  waliKelas = 'Budi Santoso',
  fotoUrl = undefined
}: ProfileCardProps) {
  return (
    <div className="bg-white px-4 pt-3 pb-3 rounded-lg shadow-md border border-gray-200">
      <div className="flex flex-col items-center">
        {fotoUrl ? (
          <img
            src={fotoUrl}
            alt={nama}
            className="w-20 h-20 rounded-full mb-3 object-cover"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-300 rounded-full mb-3 flex items-center justify-center">
            <span className="text-gray-500 text-xs">Foto</span>
          </div>
        )}

        <h2 className="font-semibold text-slate-950 text-sm">{nama}</h2>
        <p className="text-xs text-gray-500">{nis}</p>

        <div className="mt-3 w-full grid grid-cols-2 gap-1 text-center text-black">
          <div>
            <p className="text-gray-600 text-xs leading-tight">Tahun Masuk</p>
            <p className="text-slate-600 text-xs font-medium">{tahunMasuk}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs leading-tight">Wali Kelas</p>
            <p className="text-slate-600 text-xs font-medium">{waliKelas}</p>
          </div>
        </div>

        <div className="mt-2 py-1 w-full grid grid-cols-2 gap-1 text-center border border-black rounded-md text-black">
          <div>
            <p className="text-gray-600 text-xs leading-tight">Kelas</p>
            <p className="text-slate-600 text-xs font-medium">{kelas}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs leading-tight">No. Absen</p>
            <p className="text-slate-600 text-xs font-medium">{noAbsen}</p>
          </div>
        </div>

      </div>
    </div>
  )
}