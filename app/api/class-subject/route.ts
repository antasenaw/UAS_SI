import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import ClassSubject from "@/models/ClassSubject";
import ClassModel from "@/models/Class";
import Subject from "@/models/Subject";
import User from "@/models/User";
import mongoose from "mongoose";

function normalizeLegacyClassSubject(doc: any) {
  if (!doc) return doc;
  if (doc.Class && !doc.classId) doc.classId = doc.Class;
  if (doc.Subject && !doc.subjectId) doc.subjectId = doc.Subject;
  if (doc.Teacher && !doc.guruPengajar) doc.guruPengajar = doc.Teacher;
  return doc;
}

async function populateClassSubjectDocs(docs: any[]) {
  const normalized = docs.map(normalizeLegacyClassSubject);
  const classIds = Array.from(new Set(normalized.map((doc) => doc.classId).filter(Boolean)));
  const subjectIds = Array.from(new Set(normalized.map((doc) => doc.subjectId).filter(Boolean)));
  const teacherIds = Array.from(new Set(normalized.map((doc) => doc.guruPengajar).filter(Boolean)));

  const [classes, subjects, teachers] = await Promise.all([
    ClassModel.find({ _id: { $in: classIds } }).lean(),
    Subject.find({ _id: { $in: subjectIds } }).lean(),
    User.find({ _id: { $in: teacherIds } }).lean(),
  ]);

  const classMap = new Map(classes.map((c) => [c._id.toString(), c]));
  const subjectMap = new Map(subjects.map((s) => [s._id.toString(), s]));
  const teacherMap = new Map(teachers.map((t) => [t._id.toString(), t]));

  return normalized.map((doc) => ({
    ...doc,
    classId: doc.classId ? classMap.get(doc.classId.toString()) : null,
    subjectId: doc.subjectId ? subjectMap.get(doc.subjectId.toString()) : null,
    guruPengajar: doc.guruPengajar ? teacherMap.get(doc.guruPengajar.toString()) : null,
  }));
}

function buildClassSubjectQuery(rawQuery: any) {
  const query: any = {};
  const orConditions: any[] = [];

  if (rawQuery.id) {
    query._id = rawQuery.id;
    return query;
  }

  if (rawQuery.classId) {
    orConditions.push({ classId: rawQuery.classId });
    orConditions.push({ Class: rawQuery.classId });
  }
  if (rawQuery.subjectId) {
    orConditions.push({ subjectId: rawQuery.subjectId });
    orConditions.push({ Subject: rawQuery.subjectId });
  }

  if (orConditions.length > 0) {
    query.$or = orConditions;
  }

  return query;
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const classId = searchParams.get('classId');
    const subjectId = searchParams.get('subjectId');

    const query = buildClassSubjectQuery({ id, classId, subjectId });
    const classSubjects = await ClassSubject.find(query).lean();
    const populated = await populateClassSubjectDocs(classSubjects);

    return NextResponse.json({ success: true, data: populated });
  } catch (error: any) {
    console.error('ClassSubject API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch class subjects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const existing = await ClassSubject.findOne({
      $or: [
        { classId: body.classId, subjectId: body.subjectId },
        { Class: body.classId, Subject: body.subjectId }
      ]
    });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Subject already assigned to this class' }, { status: 409 });
    }

    const newAssignment = await ClassSubject.create(body);
    return NextResponse.json({ success: true, data: newAssignment }, { status: 201 });
  } catch (error: any) {
    console.error('Create ClassSubject error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await ClassSubject.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Assignment deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
