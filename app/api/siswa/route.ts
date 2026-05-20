import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import User from "@/models/User";
import Enrollment from "@/models/Enrollment";
import ClassModel from "@/models/Class";
import ClassSubject from "@/models/ClassSubject";
import Subject from "@/models/Subject";
import Assignment from "@/models/Assignment";
import Grade from "@/models/Grade";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const token =
      request.cookies.get("authToken")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    const siswa = await User.findById(decoded.userId);

    if (!siswa || siswa.role !== "Siswa") {
      return NextResponse.json({ success: false, error: "Siswa tidak ditemukan" }, { status: 404 });
    }

    const enrollment = await Enrollment.findOne({ studentId: siswa._id });
    if (!enrollment) {
      return NextResponse.json({ success: false, error: "Enrollment tidak ditemukan" }, { status: 404 });
    }

    const kelas = await ClassModel.findById(enrollment.classId);
    const waliKelas = await User.findById(kelas?.waliKelas);

    const classSubjects = await ClassSubject.find({ classId: enrollment.classId }).populate('guruPengajar', 'name');
    const subjectIds = classSubjects.map((cs) => cs.subjectId);
    const subjects = await Subject.find({ _id: { $in: subjectIds } });

    const assignments = await Assignment.find({ classId: enrollment.classId })
      .populate('mataPelajaran', 'namaMataPelajaran')
      .sort({ deadline: 1 })
      .limit(5);

    const grades = await Grade.find({ studentId: siswa._id }).populate('subjectId', 'namaMataPelajaran');
    const rataRata = grades.length > 0
        ? Math.round(grades.reduce((acc, item) => acc + item.nilai, 0) / grades.length)
        : 0;

    return NextResponse.json({
      success: true,
      profile: {
        name: siswa.name,
        nis: siswa.noInduk,
        kelas: kelas ? `${kelas.angkatan} ${kelas.jurusan} ${kelas.namaKelas}` : "-",
        waliKelas: waliKelas?.name || "-",
        tahunMasuk: kelas?.createdAt.getFullYear().toString() || "-",
      },
      subjects: classSubjects.map((cs) => {
        const subject = subjects.find(s => s._id.toString() === cs.subjectId.toString());
        return {
          id: cs._id,
          nama: subject?.namaMataPelajaran || "-",
          guru: (cs.guruPengajar as any)?.name || "-",
          hari: cs.hari || "-",
          jam: `${cs.hari} ${cs.jamMulai} - ${cs.jamSelesai}`,
        };
      }),
      assignments: assignments.map((a) => {
        const cs = classSubjects.find(csItem => csItem.subjectId.toString() === a.mataPelajaran?._id.toString());
        return {
          id: a._id,
          namaPekerjaan: a.judul,
          deadline: a.deadline,
          classSubjectId: cs?._id || "-",
          mataKuliah: (a.mataPelajaran as any)?.namaMataPelajaran || "-",
          status: 'belum',
        };
      }),
      grades,
      rataRata,
      chartData: {
        scoreData: grades.map(g => ({
          nama: `Tugas ${g.createdAt.getMonth() + 1}`,
          score: g.nilai || 0,
          deadline: g.createdAt.toLocaleString('default', { month: 'short' })
        })).slice(-6),
        averageData: Array.from({ length: 6 }, (_, i) => {
          const month = new Date();
          month.setMonth(month.getMonth() - (5 - i));
          const monthStr = month.toLocaleString('default', { month: 'short' });
          const monthGrades = grades.filter(g => g.createdAt.getMonth() === month.getMonth());
          const avg = monthGrades.length > 0 
            ? monthGrades.reduce((acc, curr) => acc + (curr.nilai || 0), 0) / monthGrades.length 
            : 0;
          return { bulan: monthStr, rataRata: Math.round(avg) };
        })
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
