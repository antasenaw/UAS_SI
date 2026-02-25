"use client"

import { usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export default function Sidebar() {
  const pathname = usePathname()

  // sementara hardcode dulu
  const role = pathname.split("/")[1] 
  // hasilnya: siswa / guru / admin

  const menuByRole: any = {
    siswa: [
      { name: "Beranda", href: "/siswa" },
      { name: "Kelas", href: "/siswa/kelas" },
      { name: "Tugas", href: "/siswa/tugas" },
      { name: "Analisa", href: "/siswa/analisa" },
    ],
    guru: [
      { name: "Beranda", href: "/guru" },
      { name: "Kelola Nilai", href: "/guru/nilai" },
      { name: "Kelas", href: "/guru/kelas" },
    ],
    admin: [
      { name: "Dashboard", href: "/admin" },
      { name: "Manajemen User", href: "/admin/users" },
      { name: "Data Sekolah", href: "/admin/sekolah" },
    ],
  }

  const menu = menuByRole[role] || []

  return (
    <aside className="w-64 bg-white shadow-md p-6 pt-20 flex flex-col">
      <div className="grid grid-cols-2 bg-amber-300 items-center mb-20 px-5 space-between">
      <Image
        src="/src/logo.png"
        alt="Logo"
        width={70}
        height={70}
        className="rounded-full"
      />
      <h1 className="text-2xl text-black items-center text-center">Siakad</h1>
      </div>

      <nav className="space-y-4 text-xl">
        {menu.map((item: any) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block ${
              pathname === item.href
                ? "text-teal-600 font-semibold"
                : "text-gray-600"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-10 text-red-500 cursor-pointer">
        Keluar
      </div>
    </aside>
  )
}