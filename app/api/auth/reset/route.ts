import connectDB from "@/lib/mongodb"
import { NextResponse } from "next/server"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    await connectDB()
    const { noInduk, password } = await request.json()

    if (!noInduk || !password) {
      return NextResponse.json(
        { success: false, error: "NISN dan password baru harus diisi" },
        { status: 400 }
      )
    }

    const user = await User.findOne({ noInduk })
    if (!user) {
      return NextResponse.json(
        { success: false, error: "NISN tidak ditemukan" },
        { status: 404 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    user.password_hash = hashedPassword
    await user.save()

    return NextResponse.json({ success: true, message: "Password berhasil direset" })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}
