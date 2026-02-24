import ProfileCard from "@/components/profileCard"
import Topbar from "@/components/topbar"

export default function SiswaDashboard() {
  return (
    <div>
      <Topbar />
      <h1 className="text-2xl text-black font-semibold mb-6">
        Selamat Datang Yogi 👋
      </h1>

      <div className="grid grid-cols-4 gap-6">
        
        {/* KIRI */}
        <div className="col-span-3 space-y-6">
          <div className="bg-white text-black p-6 rounded-xl shadow">
            Mata Pelajaran
          </div>

          <div className="bg-white text-black p-6 rounded-xl shadow">
            Analisa
          </div>
        </div>

        {/* KANAN */}
        <div className="col-span-1 space-y-6 self-start">
          <ProfileCard />

          <div className="bg-white text-black p-6 rounded-xl shadow">
            Tugas
          </div>
        </div>

      </div>
    </div>
  )
}