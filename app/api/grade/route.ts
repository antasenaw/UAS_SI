import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Grade from "@/models/Grade";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const classId = searchParams.get('classId');

    let query: any = {};
    if (studentId) query.studentId = studentId;
    if (classId) query.classId = classId;

    const grades = await Grade.find(query)
      .populate('studentId', 'name noInduk')
      .populate('subjectId', 'namaMataPelajaran')
      .populate('classId', 'namaKelas');

    return NextResponse.json({ success: true, data: grades });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch grades' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const newGrade = await Grade.create(body);
    return NextResponse.json({ success: true, data: newGrade }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
