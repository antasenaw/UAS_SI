'use client'

export interface UserProfile {
  name: string
  email: string
  telepon: string
  alamat: string
  image?: string
}

export interface SiswaProfile extends UserProfile {
  nis: string
  kelas: string
  noAbsen: string
  tahunMasuk: string
  waliKelas: string
}

export interface GuruProfile extends UserProfile {
  nip: string
  bidangStudi: string
  noKontakDarurat: string
}

export interface AdminProfile extends UserProfile {
  nip: string
  posisi: string
}

export const currentSiswaProfile: SiswaProfile = {
  name: 'Muhammad Rizki',
  nis: '247006111067',
  kelas: 'XII MIPA 4',
  noAbsen: '12',
  tahunMasuk: '2023/2024',
  waliKelas: 'Budi Santoso',
  email: 'rizki.siswa@email.com',
  telepon: '081234567890',
  alamat: 'Jl. Merdeka No. 10, Jakarta',
  image: undefined,
}

export const currentGuruProfile: GuruProfile = {
  name: 'Budi Santoso',
  nip: '198305101994031001',
  bidangStudi: 'Fisika',
  email: 'budi.santoso@email.com',
  telepon: '081234567891',
  alamat: 'Jl. Ahmad Yani No. 25, Jakarta',
  noKontakDarurat: '085234567891',
  image: undefined,
}

export const currentAdminProfile: AdminProfile = {
  name: 'Admin Sekolah',
  nip: '198710151993032001',
  posisi: 'Administrator Sistem',
  email: 'admin@sekolah.edu',
  telepon: '081234567892',
  alamat: 'Jl. Pendidikan No. 15, Jakarta',
  image: undefined,
}
