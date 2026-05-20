import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Grade from '@/models/Grade'
import Subject from '@/models/Subject'
import { analyzeStudent, GRADE_CLASSIFICATIONS } from '@/lib/dss/classifier'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

async function getAuthenticatedStudent(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
    if (decoded.role !== 'Siswa') return null

    await connectDB()
    return await User.findById(decoded.userId)
  } catch (error) {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const student = await getAuthenticatedStudent(request)
    if (!student) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Get all grades for this student
    const grades = await Grade.find({ studentId: student._id })
      .populate('subjectId', 'namaMataPelajaran kode')
      .populate('classId', 'namaKelas')
      .lean()

    if (grades.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          student: {
            id: student._id.toString(),
            name: student.name,
            noInduk: student.noInduk,
          },
          personalAnalysis: {
            studentName: student.name,
            averageGrade: 0,
            classification: 'Belum ada nilai',
            color: '#999999',
            recommendations: ['Belum ada nilai yang tercatat. Tunggu penilaian dari guru.'],
            priority: 'low' as const,
            actions: [],
          },
          gradesBySubject: [],
          distributionData: GRADE_CLASSIFICATIONS.map((gc) => ({
            name: gc.label,
            value: 0,
            percentage: 0,
            color: gc.color,
          })),
        },
      })
    }

    // Extract grade values
    const gradeValues = grades.map((g) => g.nilai)

    // Analyze student
    const personalAnalysis = analyzeStudent(student.name, gradeValues)

    // Group by subject
    const gradesBySubject: any[] = []
    const subjectMap = new Map<string, { grades: number[]; subject: any }>()

    grades.forEach((g) => {
      const subjectId = (g.subjectId as any)?._id?.toString()
      const subjectName = (g.subjectId as any)?.namaMataPelajaran || 'Lainnya'

      if (!subjectMap.has(subjectId)) {
        subjectMap.set(subjectId, {
          subject: g.subjectId,
          grades: [],
        })
      }

      subjectMap.get(subjectId)!.grades.push(g.nilai)
    })

    subjectMap.forEach((data, subjectId) => {
      const avg = data.grades.length > 0 ? Math.round(data.grades.reduce((a, b) => a + b) / data.grades.length * 10) / 10 : 0
      const subject = data.subject as any
      gradesBySubject.push({
        id: subjectId,
        name: subject?.namaMataPelajaran || 'Lainnya',
        kode: subject?.kode || '-',
        averageGrade: avg,
        totalGrades: data.grades.length,
        grades: data.grades,
      })
    })

    // Calculate distribution
    const distributionData = GRADE_CLASSIFICATIONS.map((gc) => {
      const count = gradeValues.filter(
        (g) => g >= gc.range[0] && g <= gc.range[1]
      ).length
      return {
        name: gc.label,
        value: count,
        percentage: gradeValues.length > 0 ? Math.round((count / gradeValues.length) * 100) : 0,
        color: gc.color,
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        student: {
          id: student._id.toString(),
          name: student.name,
          noInduk: student.noInduk,
        },
        personalAnalysis,
        gradesBySubject,
        distributionData,
      },
    })
  } catch (error) {
    console.error('API DSS Siswa Error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
