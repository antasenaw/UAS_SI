"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ResetPasswordPage() {
  const [noInduk, setNoInduk] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!noInduk.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Semua field harus diisi")
      return
    }

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok")
      return
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ noInduk: noInduk.trim(), password: password.trim() })
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Gagal mereset password')
        return
      }

      setSuccess(data.message || 'Password berhasil direset')
      setNoInduk("")
      setPassword("")
      setConfirmPassword("")

      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } catch (err) {
      setError('Terjadi kesalahan koneksi')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-800 flex items-center justify-start pl-32">
        <Image
          src="/src/logo.png"
          alt="Logo"
          width={250}
          height={250}
          className="rounded-full"
        />
      </div>

      <div className="absolute right-0 top-0 h-full w-[70%] bg-gray-100 rounded-l-[350px] flex items-center justify-center">
        <div className="w-full max-w-md p-12 rounded-4xl shadow-lg border-2 border-blue-800 bg-white">
          <h2 className="text-2xl font-semibold mb-6 text-center text-blue-800">
            Reset Password
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-sm">
              {success} Redirecting ke login…
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="NISN"
              value={noInduk}
              onChange={(e) => setNoInduk(e.target.value)}
              className="w-full px-5 py-3 rounded-full bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Password baru"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 rounded-full bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Konfirmasi password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-5 py-3 rounded-full bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Memproses...' : 'Reset Password'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Sudah ingat password?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
