import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    
    const users = await User.find().limit(10);
    
    return NextResponse.json({
      success: true,
      data: users
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: `Failed to fetch siswa: ${error}` },
      { status: 500 }
    );
  }
}
