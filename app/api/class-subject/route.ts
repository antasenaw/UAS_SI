import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import ClassSubject from "@/models/ClassSubject";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const subjectId = searchParams.get('subjectId');

    let query: any = {};
    if (classId) query.classId = classId;
    if (subjectId) query.subjectId = subjectId;

    const classSubjects = await ClassSubject.find(query)
      .populate('classId')
      .populate('subjectId')
      .populate('guruPengajar', 'name');

    return NextResponse.json({ success: true, data: classSubjects });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch class subjects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const existing = await ClassSubject.findOne({ classId: body.classId, subjectId: body.subjectId });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Subject already assigned to this class' }, { status: 409 });
    }

    const newAssignment = await ClassSubject.create(body);
    return NextResponse.json({ success: true, data: newAssignment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await ClassSubject.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Assignment deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
