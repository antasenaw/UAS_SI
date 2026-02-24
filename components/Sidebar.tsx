"use client"

import { usePathname } from "next/navigation"
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
    <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
      <h1 className="text-xl font-bold mb-8">Siakad</h1>

      <nav className="space-y-4">
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