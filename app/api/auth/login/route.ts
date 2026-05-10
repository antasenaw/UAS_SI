import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: Request) {
  try {
    console.log("Login attempt started");
    await connectDB();
    console.log("Database connected");

    const { noInduk, password } = await request.json();
    console.log("Login data:", { noInduk, password: "***" });

    if (!noInduk || !password) {
      console.log("Missing credentials");
      return NextResponse.json(
        { success: false, error: "NISN dan password harus diisi" },
        { status: 400 }
      );
    }

    // Find user by noInduk (NISN)
    console.log("Searching for user with noInduk:", noInduk);
    const user = await User.findOne({ noInduk }).select("+password_hash");
    console.log("User found:", user ? { _id: user._id, name: user.name, role: user.role } : "No user found");

    if (!user) {
      console.log("User not found");
      return NextResponse.json(
        { success: false, error: "NISN atau password salah" },
        { status: 401 }
      );
    }

    // Check password
    console.log("Checking password");
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash
    );
    console.log("Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("Invalid password");
      return NextResponse.json(
        { success: false, error: "NISN atau password salah" },
        { status: 401 }
      );
    }

    // Check if user is active
    console.log("Checking user status:", user.status);
    if (user.status !== "Aktif") {
      console.log("User not active");
      return NextResponse.json(
        { success: false, error: "Akun Anda tidak aktif" },
        { status: 403 }
      );
    }

    console.log("Login successful for user:", user.name, "with role:", user.role);

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        noInduk: user.noInduk
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return user data without password
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      noInduk: user.noInduk,
      role: user.role,
      status: user.status
    };

    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
      token,
      user: userData
    });

    // Set cookie on server side so middleware can read it
    response.cookies.set('authToken', token, {
      httpOnly: false, // Allow client to read it
      secure: false, // Set to true in production with HTTPS
      sameSite: 'lax',
      maxAge: 604800, // 7 days
      path: '/'
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
