import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Subject from "@/models/Subject";
import ClassSubject from "@/models/ClassSubject";
import User from "@/models/User";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const subject = await Subject.findById(id).populate("pengampu");
      return NextResponse.json({ success: true, data: subject });
    }

    const subjects = await Subject.find().populate("pengampu");
    console.log(`Fetched ${subjects.length} subjects`);
    return NextResponse.json({ success: true, data: subjects });
  } catch (error: any) {
    console.error("Subject Fetch Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const newSubject = await Subject.create(body);
    return NextResponse.json({ success: true, data: newSubject }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    const updatedSubject = await Subject.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ success: true, data: updatedSubject });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await Subject.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Subject deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
