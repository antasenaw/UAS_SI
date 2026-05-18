import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Assignment from "@/models/Assignment";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const teacherId = searchParams.get('teacherId');

    let query: any = {};
    if (classId) query.classId = classId;
    if (teacherId) query.teacherId = teacherId;

    const assignments = await Assignment.find(query)
      .populate('mataPelajaran', 'namaMataPelajaran')
      .populate('classId', 'namaKelas');
    return NextResponse.json({ success: true, data: assignments });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch assignments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const newAssignment = await Assignment.create(body);
    return NextResponse.json({ success: true, data: newAssignment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
