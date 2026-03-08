import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Grade from "@/models/Grade";

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const studentId = searchParams.get('studentId');
    const classSubjectId = searchParams.get('classSubjectId');
    const periodId = searchParams.get('periodId');
    const status = searchParams.get('status');

    let query = {};
    if (id) {
      query = { _id: id };
    } else {
      if (studentId) query = { ...query, Student: studentId };
      if (classSubjectId) query = { ...query, ClassSubject: classSubjectId };
      if (periodId) query = { ...query, Period: periodId };
      if (status) query = { ...query, gradeStatus: status };
    }

    const grades = await Grade.find(query)
      .populate('Student', 'name noInduk email')
      .populate({
        path: 'ClassSubject',
        populate: [
          { path: 'Class', select: 'grade major section' },
          { path: 'Subject', select: 'name' },
          { path: 'Teacher', select: 'name email' }
        ]
      })
      .populate('Period', 'name semester year');
    
    return NextResponse.json({
      success: true,
      count: grades.length,
      data: grades
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch grades' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Check if grade record already exists
    const existing = await Grade.findOne({
      Student: body.Student,
      ClassSubject: body.ClassSubject,
      Period: body.Period
    });
    
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Nilai untuk siswa ini sudah ada' },
        { status: 409 }
      );
    }

    const newGrade = await Grade.create(body);
    
    return NextResponse.json(
      { success: true, data: newGrade },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create grade';
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
    
    const updatedGrade = await Grade.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedGrade) {
      return NextResponse.json(
        { success: false, error: 'Nilai tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedGrade
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update grade';
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

    const deletedGrade = await Grade.findByIdAndDelete(id);

    if (!deletedGrade) {
      return NextResponse.json(
        { success: false, error: 'Nilai tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Nilai berhasil dihapus',
      data: deletedGrade
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete grade';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
