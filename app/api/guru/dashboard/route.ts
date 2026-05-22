import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import ClassSubject from "@/models/ClassSubject";
import ClassModel from "@/models/Class";
import Enrollment from "@/models/Enrollment";
import Grade from "@/models/Grade";
import Material from "@/models/Material";
import Assignment from "@/models/Assignment";
import Subject from "@/models/Subject";
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

function normalizeClassSubject(cs: any) {
  if (!cs) return cs;
  if (cs.Class && !cs.classId) cs.classId = cs.Class;
  if (cs.Subject && !cs.subjectId) cs.subjectId = cs.Subject;
  if (cs.Teacher && !cs.guruPengajar) cs.guruPengajar = cs.Teacher;
  return cs;
}

function normalizeLegacyClass(doc: any) {
  if (!doc) return doc;
  if (doc.grade && !doc.angkatan) doc.angkatan = doc.grade;
  if (doc.major && !doc.jurusan) doc.jurusan = doc.major;
  if (doc.section && !doc.namaKelas) doc.namaKelas = doc.section;
  return doc;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authHeader = request.headers.get("authorization");
    const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : undefined;
    const token =
      request.cookies.get("authToken")?.value ||
      headerToken;

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    } catch (error: any) {
      console.error("JWT verify error:", error);
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const guru = await User.findById(decoded.userId);

    if (!guru || guru.role !== "Guru") {
      return NextResponse.json({ success: false, error: "Guru tidak ditemukan" }, { status: 404 });
    }

    const teacherId = new mongoose.Types.ObjectId(guru._id);
    const classSubjects = await ClassSubject.find({
      $or: [
        { guruPengajar: teacherId },
        { Teacher: teacherId }
      ]
    }).lean();

    const normalizedClassSubjects = classSubjects.map(normalizeClassSubject);
    const classIds = normalizedClassSubjects.map(cs => cs.classId).filter(Boolean);
    const studentEnrollments = classIds.length > 0
      ? await Enrollment.find({ classId: { $in: classIds } })
      : [];
    const studentIds = [...new Set(studentEnrollments.map((e) => e.studentId.toString()))];

    const grades = await Grade.find({ teacherId: guru._id });
    const avgGrade = grades.length > 0
      ? grades.reduce((acc, curr) => acc + (curr.nilai || 0), 0) / grades.length
      : 0;

    const populatedClasses = await Promise.all(normalizedClassSubjects.map(async (cs) => {
      const classDoc = await ClassModel.findById(cs.classId);
      const subjectDoc = cs.subjectId ? await Subject.findById(cs.subjectId) : null;

      const studentCount = studentEnrollments.filter(e => e.classId.toString() === classDoc?._id.toString()).length;
      let topikTerbaru = 'Belum ada materi terbaru';

      if (subjectDoc) {
        const material = await Material.findOne({ teacherId: guru._id, mataPelajaran: subjectDoc._id }).sort({ tanggalUpload: -1 });
        if (material) {
          topikTerbaru = material.judul;
        } else {
          const assignment = await Assignment.findOne({ teacherId: guru._id, mataPelajaran: subjectDoc._id }).sort({ deadline: -1 });
          if (assignment) {
            topikTerbaru = assignment.judul;
          }
        }
      }

      const normalizedClassDoc = normalizeLegacyClass(classDoc);
      return {
        id: cs.classId?.toString() || cs._id?.toString() || '',
        nama: `${normalizedClassDoc?.angkatan || ''} ${normalizedClassDoc?.jurusan || ''} ${normalizedClassDoc?.namaKelas || ''}`.trim(),
        jumlahSiswa: studentCount,
        mataPelajaran: subjectDoc?.namaMataPelajaran || '-',
        topikTerbaru,
      };
    }));

    const waliClass = await ClassModel.findOne({ waliKelas: guru._id });
    let siswaAnalisa: any[] = [];
    if (waliClass) {
      const waliEnrollments = await Enrollment.find({ classId: waliClass._id });
      const waliStudentIds = waliEnrollments.map(e => e.studentId);
      const waliStudents = await User.find({ _id: { $in: waliStudentIds } });
      const waliGrades = await Grade.find({ studentId: { $in: waliStudentIds } });

      siswaAnalisa = waliStudents.map(s => {
        const sGrades = waliGrades.filter(g => g.studentId.toString() === s._id.toString());
        const avg = sGrades.length > 0
          ? sGrades.reduce((acc, curr) => acc + (curr.nilai || 0), 0) / sGrades.length
          : 0;

        return {
          id: s._id.toString(),
          nama: s.name,
          nis: s.noInduk || s.nis || '',
          noUrut: s.noUrut || '',
          kelas: `${waliClass.angkatan} ${waliClass.jurusan} ${waliClass.namaKelas}`,
          rataRataNilai: Math.round(avg),
          status: avg >= 80 ? 'baik' : avg >= 60 ? 'cukup' : 'kurang'
        };
      });
    }

    const mataPelajaran = Array.from(new Set(populatedClasses
      .map((cls) => cls.mataPelajaran)
      .filter(Boolean)));

    return NextResponse.json({
      success: true,
      profile: {
        name: guru.name,
        nip: guru.noInduk,
        mataPelajaran,
      },
      stats: {
        totalKelas: populatedClasses.length,
        totalSiswa: studentIds.length,
        rataRataNilai: Math.round(avgGrade * 10) / 10
      },
      classes: populatedClasses,
      siswaAnalisa,
      waliKelasClassName: waliClass ? `${waliClass.angkatan} ${waliClass.jurusan} ${waliClass.namaKelas}` : null
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
