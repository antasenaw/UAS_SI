import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import ClassSubject from "@/models/ClassSubject";

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const classId = searchParams.get('classId');
    const subjectId = searchParams.get('subjectId');
    const teacherId = searchParams.get('teacherId');

    let query = {};
    if (id) {
      query = { _id: id };
    } else {
      if (classId) query = { ...query, Class: classId };
      if (subjectId) query = { ...query, Subject: subjectId };
      if (teacherId) query = { ...query, Teacher: teacherId };
    }

    const classSubjects = await ClassSubject.find(query)
      .populate('Class', 'grade major section')
      .populate('Subject', 'name')
      .populate('Teacher', 'name email');
    
    return NextResponse.json({
      success: true,
      count: classSubjects.length,
      data: classSubjects
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch class subjects' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Check if this class-subject-teacher combination already exists
    const existing = await ClassSubject.findOne({
      Class: body.Class,
      Subject: body.Subject,
      Teacher: body.Teacher
    });
    
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Kombinasi kelas, mapel, dan guru sudah ada' },
        { status: 409 }
      );
    }

    const newClassSubject = await ClassSubject.create(body);
    
    return NextResponse.json(
      { success: true, data: newClassSubject },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create class subject';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    const updatedClassSubject = await ClassSubject.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedClassSubject) {
      return NextResponse.json(
        { success: false, error: 'Kelas-Mapel tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedClassSubject
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update class subject';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const deletedClassSubject = await ClassSubject.findByIdAndDelete(id);

    if (!deletedClassSubject) {
      return NextResponse.json(
        { success: false, error: 'Kelas-Mapel tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Kelas-Mapel berhasil dihapus',
      data: deletedClassSubject
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete class subject';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
