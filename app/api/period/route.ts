import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Period from "@/models/Period";

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const active = searchParams.get('active');

    let query = {};
    if (id) {
      query = { _id: id };
    } else if (active) {
      query = { isActive: active === 'true' };
    }

    const periods = await Period.find(query);
    
    return NextResponse.json({
      success: true,
      count: periods.length,
      data: periods
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch periods' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const newPeriod = await Period.create(body);
    
    return NextResponse.json(
      { success: true, data: newPeriod },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create period';
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
    
    const updatedPeriod = await Period.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedPeriod) {
      return NextResponse.json(
        { success: false, error: 'Tahun ajaran tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedPeriod
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update period';
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

    const deletedPeriod = await Period.findByIdAndDelete(id);

    if (!deletedPeriod) {
      return NextResponse.json(
        { success: false, error: 'Tahun ajaran tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tahun ajaran berhasil dihapus',
      data: deletedPeriod
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete period';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
