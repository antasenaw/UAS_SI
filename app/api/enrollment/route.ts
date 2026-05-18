import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Enrollment from "@/models/Enrollment";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');

    if (!classId) {
      return NextResponse.json({ success: false, error: 'classId is required' }, { status: 400 });
    }

    const enrollments = await Enrollment.find({ classId }).populate('studentId', 'name noInduk');
    return NextResponse.json({ success: true, data: enrollments });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch enrollments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const existing = await Enrollment.findOne({ classId: body.classId, studentId: body.studentId });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Student already enrolled in this class' }, { status: 409 });
    }

    const newEnrollment = await Enrollment.create(body);
    return NextResponse.json({ success: true, data: newEnrollment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await Enrollment.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Enrollment removed' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
