import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    
    const siswa = await User.find({ role: 'Siswa' }).limit(10);
    
    return NextResponse.json({
      success: true,
      data: siswa
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch siswa' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const newSiswa = await User.create({
      ...body,
      role: 'Siswa',
      status: 'Aktif'
    });
    
    return NextResponse.json(
      { success: true, data: newSiswa },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: `Failed to create siswa ${error}` },
      { status: 500 }
    );
  }
}
