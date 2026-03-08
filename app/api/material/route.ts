import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Material from "@/models/Material";

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

    const materials = await Material.find(query)
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
      count: materials.length,
      data: materials
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch materials' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const newMaterial = await Material.create(body);
    
    return NextResponse.json(
      { success: true, data: newMaterial },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create material';
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
    
    const updatedMaterial = await Material.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedMaterial) {
      return NextResponse.json(
        { success: false, error: 'Materi tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedMaterial
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update material';
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

    const deletedMaterial = await Material.findByIdAndDelete(id);

    if (!deletedMaterial) {
      return NextResponse.json(
        { success: false, error: 'Materi tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Materi berhasil dihapus',
      data: deletedMaterial
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete material';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
