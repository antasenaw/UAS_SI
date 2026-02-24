"use client"

import Image from "next/image"

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-teal-800 flex items-center justify-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={200}
          height={200}
          className="rounded-full"
        />
      </div>

      <div className="w-1/2 bg-gray-100 flex items-center justify-center rounded-l-[100px]">
        <div className="w-150px">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Reset Password
          </h2>

          <input
            type="text"
            placeholder="NISN"
            className="w-full mb-4 px-4 py-2 rounded-full bg-gray-200"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 px-4 py-2 rounded-full bg-gray-200"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full mb-4 px-4 py-2 rounded-full bg-gray-200"
          />

          <button className="w-full bg-teal-700 text-white py-2 rounded-full hover:bg-teal-800 transition">
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}