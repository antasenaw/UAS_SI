import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Grade from '@/models/Grade'
import Class from '@/models/Class'
import Subject from '@/models/Subject'
import Enrollment from '@/models/Enrollment'
import { analyzeClass } from '@/lib/dss/classifier'
import mongoose from 'mongoose'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

async function getAuthenticatedGuru(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
    if (decoded.role !== 'Guru') return null

    await connectDB()
    return await User.findById(decoded.userId)
  } catch (error) {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const guru = await getAuthenticatedGuru(request)
    if (!guru) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const classIdParam = searchParams.get('classId')

    // Resolve classId: use param if provided and valid, otherwise try to find the class where the guru is waliKelas
    let resolvedClassId: string | null = null
    if (classIdParam && mongoose.isValidObjectId(classIdParam)) {
      resolvedClassId = classIdParam
    } else {
      // try find class where guru is waliKelas
      const waliClass = await Class.findOne({ waliKelas: guru._id }).lean()
      if (waliClass) resolvedClassId = waliClass._id.toString()
    }

    if (!resolvedClassId || !mongoose.isValidObjectId(resolvedClassId)) {
      return NextResponse.json(
        { success: false, error: 'Class ID tidak valid atau tidak ditemukan untuk guru ini' },
        { status: 400 }
      )
    }

    // Get class details
    const classData = await Class.findById(resolvedClassId).lean()
    if (!classData) {
      return NextResponse.json({ success: false, error: 'Kelas tidak ditemukan' }, { status: 404 })
    }

    // Get enrollments for this class
    const enrollments = await Enrollment.find({ classId: resolvedClassId }).lean()
    const studentIds = enrollments.map((e) => e.studentId)

    if (studentIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          classData,
          classAnalysis: {
            totalStudents: 0,
            averageGrade: 0,
            excellentCount: 0,
            goodCount: 0,
            fairCount: 0,
            poorCount: 0,
            excellentPercentage: 0,
            goodPercentage: 0,
            fairPercentage: 0,
            poorPercentage: 0,
            studentsNeedingAttention: [],
            classRecommendations: ['Belum ada data siswa untuk kelas ini.'],
          },
        },
      })
    }

    // Get all students with their grades
    const students = await User.find({ _id: { $in: studentIds } }).lean()
    const grades = await Grade.find({ classId: resolvedClassId, studentId: { $in: studentIds } })
      .populate('studentId', 'name')
      .lean()

    // Group grades by student
    const studentGrades: Record<string, { name: string; grades: number[] }> = {}
    students.forEach((student) => {
      studentGrades[student._id.toString()] = {
        name: student.name,
        grades: [],
      }
    })

    grades.forEach((grade) => {
      const studentId = grade.studentId?._id?.toString() || (grade.studentId as any)?.toString()
      if (studentId && studentGrades[studentId]) {
        studentGrades[studentId].grades.push(grade.nilai)
      }
    })

    // Convert to array for analysis
    const studentArray = Object.entries(studentGrades).map(([id, data]) => ({
      id,
      name: data.name,
      grades: data.grades,
    }))

    // Analyze class
    const classAnalysis = analyzeClass(studentArray)

    return NextResponse.json({
      success: true,
      data: {
        classData: {
          id: classData._id.toString(),
          namaKelas: classData.namaKelas,
          jurusan: classData.jurusan,
          angkatan: classData.angkatan,
          totalSiswa: studentIds.length,
        },
        classAnalysis,
      },
    })
  } catch (error) {
    console.error('API DSS Error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
