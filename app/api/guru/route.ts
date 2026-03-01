import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    
    const gurus = await User.find({ role: 'guru' }).limit(10);
    
    return NextResponse.json({
      success: true,
      data: gurus
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gurus' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const newGuru = await User.create({
      ...body,
      role: 'guru'
    });
    
    return NextResponse.json(
      { success: true, data: newGuru },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create guru' },
      { status: 500 }
    );
  }
}