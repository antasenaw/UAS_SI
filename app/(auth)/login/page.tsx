"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/context"

export default function LoginPage() {
  const [noInduk, setNoInduk] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login form submitted");
    setError("")
    setIsLoading(true)

    try {
      console.log("Calling login function");
      const loggedInUser = await login(noInduk, password)
      console.log("Login successful, user:", loggedInUser);

      // Redirect based on user role
      let redirectPath = '/admin'; // default
      if (loggedInUser.role === 'Admin') {
        redirectPath = '/admin'
      } else if (loggedInUser.role === 'Guru') {
        redirectPath = '/guru'
      } else if (loggedInUser.role === 'Siswa') {
        redirectPath = '/siswa'
      }

      console.log("Redirecting to:", redirectPath);
      // Use hard redirect - server has already set the cookie via Set-Cookie header
      window.location.href = redirectPath
    } catch (err) {
      console.error("Login failed:", err);
      setError(err instanceof Error ? err.message : "Login gagal")
    } finally {
      console.log("Finally block, setting isLoading to false");
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      
      {/* LEFT BACKGROUND */}
      <div className="absolute inset-0 bg-teal-800 flex items-center justify-start pl-32">
        <Image
          src="/src/logo.png"
          alt="Logo"
          width={250}
          height={250}
          className="rounded-full"
        />
      </div>

      {/* RIGHT WHITE CURVE */}
      <div className="absolute right-0 top-0 h-full w-[70%] bg-gray-100 rounded-l-[350px] flex items-center justify-center">
        <div className="w-95 p-20 rounded-4xl shadow-lg border-2 border-teal-800">
          <h2 className="text-2xl font-semibold mb-10 text-center text-teal-800">
            Masuk
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="NISN"
              value={noInduk}
              onChange={(e) => setNoInduk(e.target.value)}
              className="w-full mb-4 px-8 py-3 text-black rounded-full bg-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-800"
              required
              disabled={isLoading}
            />

            <input
              type="password"
              placeholder="Kata Sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-2 px-5 py-3 rounded-full text-black bg-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-800"
              required
              disabled={isLoading}
            />

            <div className="text-right text-sm text-gray-500 mb-4 cursor-pointer hover:text-teal-800">
              Lupa password?
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-700 text-white py-3 rounded-full hover:bg-teal-800 transition disabled:bg-teal-500 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sedang login..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}