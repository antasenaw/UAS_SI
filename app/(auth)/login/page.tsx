"use client"

import Image from "next/image"

export default function LoginPage() {
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
        <div className="w-[380px] p-20 rounded-4xl shadow-lg border-2 border-teal-800">
          <h2 className="text-2xl font-semibold mb-10 text-center text-teal-800">
            Masuk
          </h2>

          <input
            type="text"
            placeholder="NISN"
            className="w-full mb-4 px-8 py-3 text-black rounded-full bg-gray-200 focus:outline-teal-800"
          />

          <input
            type="password"
            placeholder="Kata Sandi"
            className="w-full mb-2 px-5 py-3 rounded-full text-black bg-gray-200 focus:outline-teal-800"
          />

          <div className="text-right text-sm text-gray-500 mb-4 cursor-pointer">
            Lupa password?
          </div>

          <button className="w-full bg-teal-700 text-white py-3 rounded-full hover:bg-teal-800 transition">
            Login
          </button>
        </div>
      </div>
    </div>
  )
}