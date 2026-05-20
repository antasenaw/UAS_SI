import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';
import User from "@/models/User";
import ClassModel from "@/models/Class";
import Subject from "@/models/Subject";
import Grade from "@/models/Grade";
import Enrollment from "@/models/Enrollment";
import Period from "@/models/Period";
import Assignment from "@/models/Assignment";
import Submission from "@/models/Submission";


export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // 1. Real Counts (Case-insensitive role check)
    const totalSiswa = await User.countDocuments({ role: { $regex: /^siswa$/i } });
    const totalGuru = await User.countDocuments({ role: { $regex: /^guru$/i } });
    const totalKelas = await ClassModel.countDocuments();
    const totalMapel = await Subject.countDocuments();

    // 2. Real Average Grade
    const grades = await Grade.find();
    const avgGrade = grades.length > 0 
      ? grades.reduce((acc, curr) => acc + (curr.nilai || 0), 0) / grades.length 
      : 0;

    // 3. Real Distribution (Student count per class)
    const classes = await ClassModel.find().limit(6);
    const distribution = await Promise.all(classes.map(async (c) => {
      const count = await Enrollment.countDocuments({ classId: c._id });
      
      const label = [
        c.namaKelas || c.section || '',
        c.angkatan || c.grade || '',
        c.jurusan || c.major || ''
      ].filter(Boolean).join(' ');

      return {
        kelas: label || `Kelas ${c._id.toString().substring(0, 5)}`,
        jumlah: count
      };
    }));

    // 4. Real Progress
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const now = new Date();
    const progress = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);

      const monthGrades = await Grade.find({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
      });

      const monthAvg = monthGrades.length > 0
        ? monthGrades.reduce((acc, curr) => acc + (curr.nilai || 0), 0) / monthGrades.length
        : 0;

      progress.push({
        bulan: months[d.getMonth()],
        rata: Math.round(monthAvg)
      });
    }

    // 5. Active Period
    const activePeriod = await Period.findOne({ aktif: true });

    // 6. Real Recent Activities (Latest Submissions/Grades)
    console.log('Registered mongoose models before dynamic import:', mongoose.modelNames());
    await import('@/models/Assignment');
    console.log('Registered mongoose models after dynamic import:', mongoose.modelNames());
    const latestSubmissions = await Submission.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('studentId', 'name')
      .populate({
        path: 'assignmentId',
        select: 'judul'
      });

    const recentActivities = latestSubmissions.map(sub => ({
      title: `Pengumpulan: ${(sub as any).assignmentId?.judul || 'Tugas'}`,
      user: (sub as any).studentId?.name || 'Siswa',
      time: sub.createdAt ? new Date(sub.createdAt).toLocaleString('id-ID') : 'Baru saja',
      type: 'submission'
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalSiswa,
        totalGuru,
        totalKelas,
        totalMapel,
        rataRataNilai: Math.round(avgGrade * 10) / 10,
        kehadiran: 98.2
      },
      activePeriod: activePeriod ? {
        tahunAjaran: activePeriod.tahunAjaran,
        semester: activePeriod.semester,
        status: activePeriod.aktif ? 'Aktif' : 'Nonaktif'
      } : {
        tahunAjaran: "2025/2026",
        semester: "Genap",
        status: "Aktif"
      },
      distribution,
      progress,
      recentActivities: recentActivities.length > 0 ? recentActivities : [
        { title: "Sistem Online", user: "Admin", time: "Hari ini", type: "info" },
        { title: "Sinkronisasi Database", user: "System", time: "1 jam lalu", type: "info" }
      ]
    });

  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    const isDev = process.env.NODE_ENV !== 'production';
    return NextResponse.json({ success: false, error: isDev ? (error.message || String(error)) : 'Internal server error' }, { status: 500 });
  }
}
