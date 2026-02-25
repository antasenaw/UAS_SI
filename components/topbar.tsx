"use client"

import { Bell, Search } from "lucide-react"
import Image from "next/image"

export default function Topbar() {
  return (
    <div className="flex items-center gap-6 ">
      
      {/* Search */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-full w-220 border border-black">
        <Search size={18} className="text-gray-800" />
        <input
          type="text"
          placeholder="Cari..."
          className="bg-transparent outline-none text-black text-sm w-full"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6 mr-">
        
        {/* Notifikasi */}
        <div className="relative cursor-pointer">
          <Bell size={22} className="text-gray-700" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
            3
          </span>
        </div>

        {/* Akun */}
        <div className="flex items-center gap-3 cursor-pointer">
          <Image
            src="/avatar.png"
            alt="avatar"
            width={35}
            height={35}
            className="rounded-full"
          />
          <div className="text-sm">
            <p className="font-semibold text-black">Yogi Nugraha</p>
            <p className="text-gray-500 text-xs">Siswa</p>
          </div>
        </div>

      </div>
    </div>
  )
}