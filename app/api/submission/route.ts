import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Submission from "@/models/Submission";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get('assignmentId');
    const studentId = searchParams.get('studentId');

    let query: any = {};
    if (assignmentId) query.assignmentId = assignmentId;
    if (studentId) query.studentId = studentId;

    const submissions = await Submission.find(query)
      .populate('assignmentId', 'judul')
      .populate('studentId', 'name');
    return NextResponse.json({ success: true, data: submissions });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const newSubmission = await Submission.create(body);
    return NextResponse.json({ success: true, data: newSubmission }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
