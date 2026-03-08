import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Submission from "@/models/Submission";

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const assignmentId = searchParams.get('assignmentId');
    const studentId = searchParams.get('studentId');
    const status = searchParams.get('status');

    let query = {};
    if (id) {
      query = { _id: id };
    } else {
      if (assignmentId) query = { ...query, Assignment: assignmentId };
      if (studentId) query = { ...query, Student: studentId };
      if (status) query = { ...query, status };
    }

    const submissions = await Submission.find(query)
      .populate('Assignment', 'title dueDate')
      .populate('Student', 'name noInduk email');
    
    return NextResponse.json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Check if student already submitted this assignment
    const existing = await Submission.findOne({
      Assignment: body.Assignment,
      Student: body.Student
    });
    
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Siswa sudah mengirimkan tugas ini' },
        { status: 409 }
      );
    }

    const newSubmission = await Submission.create(body);
    
    return NextResponse.json(
      { success: true, data: newSubmission },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create submission';
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
    
    const updatedSubmission = await Submission.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedSubmission) {
      return NextResponse.json(
        { success: false, error: 'Pengiriman tugas tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedSubmission
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update submission';
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

    const deletedSubmission = await Submission.findByIdAndDelete(id);

    if (!deletedSubmission) {
      return NextResponse.json(
        { success: false, error: 'Pengiriman tugas tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Pengiriman tugas berhasil dihapus',
      data: deletedSubmission
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete submission';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
