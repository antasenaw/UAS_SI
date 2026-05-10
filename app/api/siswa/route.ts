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

    // =========================
    // GET TOKEN
    // =========================

    const token =
      request.cookies.get("authToken")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // =========================
    // VERIFY TOKEN
    // =========================

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: string;
    };

    // =========================
    // GET USER
    // =========================

    const siswa = await User.findById(decoded.userId);

    if (!siswa || siswa.role !== "Siswa") {
      return NextResponse.json(
        {
          success: false,
          error: "Siswa tidak ditemukan",
        },
        {
          status: 404,
        }
      );
    }

    // =========================
    // GET ENROLLMENT
    // =========================

    const enrollment = await Enrollment.findOne({
      studentId: siswa._id,
    });

    if (!enrollment) {
      return NextResponse.json(
        {
          success: false,
          error: "Enrollment tidak ditemukan",
        },
        {
          status: 404,
        }
      );
    }

    // =========================
    // GET CLASS
    // =========================

    const kelas = await ClassModel.findById(enrollment.classId);

    // =========================
    // GET WALI KELAS
    // =========================

    const waliKelas = await User.findById(kelas.waliKelas);

    // =========================
    // GET SUBJECTS
    // =========================

    const classSubjects = await ClassSubject.find({
      classId: kelas._id,
    });

    const subjectIds = classSubjects.map((cs) => cs.subjectId);

    const subjects = await Subject.find({
      _id: {
        $in: subjectIds,
      },
    });

    // =========================
    // GET ASSIGNMENTS
    // =========================

    const assignments = await Assignment.find({
      classId: kelas._id,
    })
      .sort({ deadline: 1 })
      .limit(5);

    // =========================
    // GET GRADES
    // =========================

    const grades = await Grade.find({
      studentId: siswa._id,
    });

    const rataRata =
      grades.length > 0
        ? Math.round(
            grades.reduce((acc, item) => acc + item.nilai, 0) /
              grades.length
          )
        : 0;

    // =========================
    // RESPONSE
    // =========================

    return NextResponse.json({
      success: true,

      profile: {
        name: siswa.name,
        nis: siswa.noInduk,
        kelas: kelas.namaKelas,
        waliKelas: waliKelas?.name || "-",
        tahunMasuk: kelas.angkatan,
      },

      subjects: classSubjects.map((cs) => {
        const subject = subjects.find(
          (s) => s._id.toString() === cs.subjectId.toString()
        );

        return {
          id: cs._id,
          nama: subject?.namaMataPelajaran || "-",
          jam: `${cs.hari} ${cs.jamMulai} - ${cs.jamSelesai}`,
        };
      }),

      assignments: assignments.map((a) => ({
        id: a._id,
        namaPekerjaan: a.judul,
        deadline: a.deadline,
        status: a.status,
      })),

      grades,

      rataRata,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const newSiswa = await User.create({
      ...body,
      role: 'Siswa',
      status: 'Aktif'
    });
    
    return NextResponse.json(
      { success: true, data: newSiswa },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: `Failed to create siswa ${error}` },
      { status: 500 }
    );
  }
}
