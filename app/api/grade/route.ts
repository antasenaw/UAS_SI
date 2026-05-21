import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Grade from "@/models/Grade";

function getLetterGrade(nilai: number) {
  if (nilai >= 85) return 'A';
  if (nilai >= 70) return 'B';
  if (nilai >= 55) return 'C';
  if (nilai >= 40) return 'D';
  return 'E';
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const classId = searchParams.get('classId');
    const subjectId = searchParams.get('subjectId');

    let query: any = {};
    if (studentId) query.studentId = studentId;
    if (classId) query.classId = classId;
    if (subjectId) query.subjectId = subjectId;

    const grades = await Grade.find(query)
      .populate('studentId', 'name noInduk')
      .populate('subjectId', 'namaMataPelajaran')
      .populate('classId', 'namaKelas');

    return NextResponse.json({ success: true, data: grades });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch grades' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { nilai, grade, ...rest } = body;
    const finalGrade = grade || getLetterGrade(Number(nilai));
    const newGrade = await Grade.create({ ...rest, nilai, grade: finalGrade });
    return NextResponse.json({ success: true, data: newGrade }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { id, studentId, subjectId, classId, nilai, teacherId } = body;
    if (!id && (!studentId || !subjectId || !classId)) {
      return NextResponse.json({ success: false, error: 'Missing grade identifier' }, { status: 400 });
    }

    const update = {
      ...(nilai !== undefined ? { nilai } : {}),
      ...(teacherId ? { teacherId } : {}),
      ...(nilai !== undefined ? { grade: getLetterGrade(Number(nilai)) } : {}),
    };

    const grade = id
      ? await Grade.findByIdAndUpdate(id, update, { new: true })
      : await Grade.findOneAndUpdate(
          { studentId, subjectId, classId },
          { $set: update },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );

    return NextResponse.json({ success: true, data: grade });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
