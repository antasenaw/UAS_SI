export default function ProfileCard() {
  return (
    <div className="bg-white px-6 pt-4 rounded-xl shadow">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-gray-300 rounded-full mb-4" />

        <h2 className="font-semibold text-slate-950 text-lg">Yogi Nugraha</h2>
        <p className="text-sm text-gray-500">247006111067</p>

        <div className="mt-4 w-full text-sm grid grid-cols-2 gap-2 text-center text-black">
          <div className="">
            <p>Tahun Masuk</p>
            <p className="text-slate-600">2023/2024</p>
          </div>
          <div>
            <p>Wali Kelas</p>
            <p className="text-slate-600">Budi Santoso</p>
          </div>
        </div>

        <div className="mt-4 py-2 w-full text-sm grid grid-cols-2 gap-2 text-center border border-black rounded-b-lg rounded-t-none text-black">
          <div className="">
            <p>Kelas</p>
            <p className="text-slate-600">XII MIPA 4</p>
          </div>
          <div>
            <p>No. Absen</p>
            <p className="text-slate-600">12</p>
          </div>
        </div>

      </div>
    </div>
  )
}