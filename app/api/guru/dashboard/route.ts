import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import ClassSubject from "@/models/ClassSubject";
import ClassModel from "@/models/Class";
import Enrollment from "@/models/Enrollment";
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
    const guru = await User.findById(decoded.userId);

    if (!guru || guru.role !== "Guru") {
      return NextResponse.json({ success: false, error: "Guru tidak ditemukan" }, { status: 404 });
    }

    // Get ClassSubjects taught by this guru
    const classSubjects = await ClassSubject.find({ guruPengajar: guru._id });
    const classIds = classSubjects.map(cs => cs.classId);
    
    // Get Classes details
    const classes = await ClassModel.find({ _id: { $in: classIds } });
    
    // Get total students
    const enrollments = await Enrollment.find({ classId: { $in: classIds } });
    const studentIds = [...new Set(enrollments.map(e => e.studentId.toString()))];

    // Get grades for these classes
    const grades = await Grade.find({ teacherId: guru._id });
    const avgGrade = grades.length > 0 
      ? grades.reduce((acc, curr) => acc + (curr.nilai || 0), 0) / grades.length 
      : 0;

    // Format classes for response
    const formattedClasses = classes.map(c => {
      const studentCount = enrollments.filter(e => e.classId.toString() === c._id.toString()).length;
      return {
        id: c._id,
        nama: `${c.angkatan} ${c.jurusan} ${c.namaKelas}`,
        jumlahSiswa: studentCount,
        topikTerbaru: "Materi terbaru belum diupdate"
      };
    });

    // Get student analysis for wali kelas (if applicable)
    const waliClass = await ClassModel.findOne({ waliKelas: guru._id });
    let siswaAnalisa = [];
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
          id: s._id,
          nama: s.name,
          kelas: `${waliClass.angkatan} ${waliClass.jurusan} ${waliClass.namaKelas}`,
          rataRataNilai: Math.round(avg),
          status: avg >= 80 ? 'baik' : avg >= 60 ? 'cukup' : 'kurang'
        };
      });
    }

    return NextResponse.json({
      success: true,
      profile: {
        name: guru.name,
        nip: guru.noInduk,
      },
      stats: {
        totalKelas: formattedClasses.length,
        totalSiswa: studentIds.length,
        rataRataNilai: Math.round(avgGrade * 10) / 10
      },
      classes: formattedClasses,
      siswaAnalisa,
      waliKelasClassName: waliClass ? `${waliClass.angkatan} ${waliClass.jurusan} ${waliClass.namaKelas}` : null
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
