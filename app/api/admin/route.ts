import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    
    const admins = await User.find({ role: 'Admin' }).limit(10);
    
    return NextResponse.json({
      success: true,
      data: admins
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admins' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const newAdmin = await User.create({
      ...body,
      role: 'Admin'
    });
    
    return NextResponse.json(
      { success: true, data: newAdmin },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create guru' },
      { status: 500 }
    );
  }
}