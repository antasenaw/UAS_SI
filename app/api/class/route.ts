import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import ClassModel from "@/models/Class";
import Enrollment from "@/models/Enrollment";
import User from "@/models/User";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const kelas = await ClassModel.findById(id).populate('waliKelas', 'name');
      return NextResponse.json({ success: true, data: kelas });
    }

    const classes = await ClassModel.find().populate('waliKelas', 'name');
    
    const enrichedClasses = await Promise.all(classes.map(async (c) => {
      const studentCount = await Enrollment.countDocuments({ classId: c._id });
      return {
        ...c.toObject(),
        jumlahSiswa: studentCount
      };
    }));

    return NextResponse.json({ success: true, data: enrichedClasses });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch classes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const newClass = await ClassModel.create(body);

    if (body.waliKelas) {
      await User.findByIdAndUpdate(body.waliKelas, { isWaliKelas: true });
    }

    return NextResponse.json({ success: true, data: newClass }, { status: 201 });
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

    const oldClass = await ClassModel.findById(id);
    const updatedClass = await ClassModel.findByIdAndUpdate(id, body, { new: true });

    if (oldClass && body.waliKelas && oldClass.waliKelas?.toString() !== body.waliKelas) {
      await User.findByIdAndUpdate(body.waliKelas, { isWaliKelas: true });
      
      const stillWali = await ClassModel.findOne({ waliKelas: oldClass.waliKelas, _id: { $ne: id } });
      if (!stillWali) {
        await User.findByIdAndUpdate(oldClass.waliKelas, { isWaliKelas: false });
      }
    }

    return NextResponse.json({ success: true, data: updatedClass });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await ClassModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Class deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
