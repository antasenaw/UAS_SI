import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Subject from "@/models/Subject";

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const name = searchParams.get('name');

    let query = {};
    if (id) {
      query = { _id: id };
    } else if (name) {
      query = { name: { $regex: name, $options: 'i' } };
    }

    const subjects = await Subject.find(query);
    
    return NextResponse.json({
      success: true,
      count: subjects.length,
      data: subjects
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subjects' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Check if subject already exists
    const existingSubject = await Subject.findOne({ name: body.name });
    if (existingSubject) {
      return NextResponse.json(
        { success: false, error: 'Mapel dengan nama ini sudah ada' },
        { status: 409 }
      );
    }

    const newSubject = await Subject.create(body);
    
    return NextResponse.json(
      { success: true, data: newSubject },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create subject';
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
    
    const updatedSubject = await Subject.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedSubject) {
      return NextResponse.json(
        { success: false, error: 'Mapel tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedSubject
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update subject';
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

    const deletedSubject = await Subject.findByIdAndDelete(id);

    if (!deletedSubject) {
      return NextResponse.json(
        { success: false, error: 'Mapel tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Mapel berhasil dihapus',
      data: deletedSubject
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete subject';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
