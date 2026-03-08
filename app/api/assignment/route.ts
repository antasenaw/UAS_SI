import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Assignment from "@/models/Assignment";

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const classSubjectId = searchParams.get('classSubjectId');
    const search = searchParams.get('search');

    let query = {};
    if (id) {
      query = { _id: id };
    } else if (classSubjectId) {
      query = { ClassSubject: classSubjectId };
    } else if (search) {
      query = { title: { $regex: search, $options: 'i' } };
    }

    const assignments = await Assignment.find(query)
      .populate({
        path: 'ClassSubject',
        populate: [
          { path: 'Class', select: 'grade major section' },
          { path: 'Subject', select: 'name' },
          { path: 'Teacher', select: 'name email' }
        ]
      });
    
    return NextResponse.json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch assignments' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const newAssignment = await Assignment.create(body);
    
    return NextResponse.json(
      { success: true, data: newAssignment },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create assignment';
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
    
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedAssignment) {
      return NextResponse.json(
        { success: false, error: 'Tugas tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedAssignment
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update assignment';
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

    const deletedAssignment = await Assignment.findByIdAndDelete(id);

    if (!deletedAssignment) {
      return NextResponse.json(
        { success: false, error: 'Tugas tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tugas berhasil dihapus',
      data: deletedAssignment
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete assignment';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
