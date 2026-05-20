import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Material from "@/models/Material";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const subjectId = searchParams.get('subjectId');
    const teacherId = searchParams.get('teacherId');

    if (id) {
      const material = await Material.findById(id).populate('mataPelajaran', 'namaMataPelajaran');
      return NextResponse.json({ success: true, data: material ? [material] : [] });
    }

    let query: any = {};
    if (subjectId) query.mataPelajaran = subjectId;
    if (teacherId) query.teacherId = teacherId;

    const materials = await Material.find(query).populate('mataPelajaran', 'namaMataPelajaran');
    return NextResponse.json({ success: true, data: materials });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch materials' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const newMaterial = await Material.create(body);
    return NextResponse.json({ success: true, data: newMaterial }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
