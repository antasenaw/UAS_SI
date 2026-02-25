import ProfileCard from "@/components/profileCard"
import Topbar from "@/components/topbar"

export default function SiswaDashboard() {
  return (
    <div>
      <Topbar />

      <div className="grid grid-cols-4 gap-6 mt-4">
        
        {/* KIRI */}
        <div className="col-span-3 space-y-4">

          <div className=" text-black p-6 rounded-xl shadow border">
             <h1 className="text-2xl text-black font-semibold mb-6 ">
              Selamat Datang Yogi 
            </h1>
          </div>
          <div>
            <h2 className=" text-black">Kelas</h2>
          </div>
            
          <div className="grid grid-cols-3 gap-3 mb-2 text-black">
            <div className="bg-white p-4 py-18 rounded-xl shadow border border-black">
              <h2 className="text-lg font-semibold mb-2">Kelas</h2>
              <p className="text-2xl font-bold">1</p>
            </div>
            <div className="bg-white p-4 py-18 rounded-xl shadow border border-black">
              <h2 className="text-lg font-semibold mb-2">Kelas</h2>
              <p className="text-2xl font-bold">2</p>
            </div>
            <div className="bg-white p-4 py-18 rounded-xl shadow border border-black">
              <h2 className="text-lg font-semibold mb-2">Kelas</h2>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
          <div>
            <h2 className=" text-black">Analisa</h2>
          </div>
          <div className="bg-white text-black p-6 rounded-xl shadow">
            
          </div>
        </div>

        {/* KANAN */}
        <div className="col-span-1 space-y-4 self-start">
          <ProfileCard />
      
          <div className=" text-black p-3">
            <p>Tugas</p>
          </div>
        </div>

      </div>
    </div>
  )
}