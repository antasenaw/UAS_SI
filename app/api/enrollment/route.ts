import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Enrollment from "@/models/Enrollment";

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const studentId = searchParams.get('studentId');
    const classId = searchParams.get('classId');
    const periodId = searchParams.get('periodId');

    let query = {};
    if (id) {
      query = { _id: id };
    } else {
      if (studentId) query = { ...query, Student: studentId };
      if (classId) query = { ...query, Class: classId };
      if (periodId) query = { ...query, Period: periodId };
    }

    const enrollments = await Enrollment.find(query)
      .populate('Student', 'name noInduk email')
      .populate('Class', 'grade major section')
      .populate('Period', 'name semester year');
    
    return NextResponse.json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch enrollments' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Check if this student is already enrolled in this class for this period
    const existing = await Enrollment.findOne({
      Student: body.Student,
      Class: body.Class,
      Period: body.Period
    });
    
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Siswa sudah terdaftar di kelas ini untuk periode ini' },
        { status: 409 }
      );
    }

    const newEnrollment = await Enrollment.create(body);
    
    return NextResponse.json(
      { success: true, data: newEnrollment },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create enrollment';
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
    
    const updatedEnrollment = await Enrollment.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedEnrollment) {
      return NextResponse.json(
        { success: false, error: 'Pendaftaran tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedEnrollment
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update enrollment';
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

    const deletedEnrollment = await Enrollment.findByIdAndDelete(id);

    if (!deletedEnrollment) {
      return NextResponse.json(
        { success: false, error: 'Pendaftaran tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil dihapus',
      data: deletedEnrollment
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete enrollment';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
