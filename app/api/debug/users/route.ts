import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    // Get all users (only for development/debugging)
    const users = await User.find({}, { password_hash: 0 }); // Exclude password

    return NextResponse.json({
      success: true,
      users: users
    });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}