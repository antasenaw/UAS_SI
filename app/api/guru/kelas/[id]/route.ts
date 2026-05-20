import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import ClassModel from '@/models/Class'
import Enrollment from '@/models/Enrollment'
import ClassSubject from '@/models/ClassSubject'
import Assignment from '@/models/Assignment'
import Subject from '@/models/Subject'
import User from '@/models/User'

function normalizeLegacyClass(doc: any) {
  if (!doc) return doc
  if (doc.grade && !doc.angkatan) doc.angkatan = doc.grade
  if (doc.major && !doc.jurusan) doc.jurusan = doc.major
  if (doc.section && !doc.namaKelas) doc.namaKelas = doc.section
  if (doc.Wali_kelas && !doc.waliKelas) doc.waliKelas = doc.Wali_kelas
  return doc
}

function normalizeLegacyClassSubject(doc: any) {
  if (!doc) return doc
  if (doc.Class && !doc.classId) doc.classId = doc.Class
  if (doc.Subject && !doc.subjectId) doc.subjectId = doc.Subject
  if (doc.Teacher && !doc.guruPengajar) doc.guruPengajar = doc.Teacher
  return doc
}

function normalizeLegacyEnrollment(doc: any) {
  if (!doc) return doc
  if (doc.Class && !doc.classId) doc.classId = doc.Class
  if (doc.Student && !doc.studentId) doc.studentId = doc.Student
  return doc
}

function normalizeLegacyAssignment(doc: any) {
  if (!doc) return doc
  if (doc.Class && !doc.classId) doc.classId = doc.Class
  if (doc.MataPelajaran && !doc.mataPelajaran) doc.mataPelajaran = doc.MataPelajaran
  if (doc.Teacher && !doc.teacherId) doc.teacherId = doc.Teacher
  return doc
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { pathname } = new URL(request.url)
    const parts = pathname.split('/')
    const kelasId = parts[parts.length - 1]

    if (!kelasId || !mongoose.isValidObjectId(kelasId)) {
      return NextResponse.json({ success: false, error: 'ID kelas tidak valid' }, { status: 400 })
    }

    let kelas = await ClassModel.findById(kelasId).lean()

    if (!kelas) {
      const classSubjectLookup = await ClassSubject.findById(kelasId).lean()
      if (classSubjectLookup) {
        const normalizedClassSubject = normalizeLegacyClassSubject(classSubjectLookup)
        if (normalizedClassSubject.classId && mongoose.isValidObjectId(normalizedClassSubject.classId)) {
          kelas = await ClassModel.findById(normalizedClassSubject.classId).lean()
        }
      }
    }

    if (!kelas) {
      return NextResponse.json({ success: false, error: 'Kelas tidak ditemukan' }, { status: 404 })
    }

    const normalizedKelas = normalizeLegacyClass(kelas)

    let waliKelas = null
    const waliKelasId = normalizedKelas.waliKelas || normalizedKelas.Wali_kelas
    if (waliKelasId && mongoose.isValidObjectId(waliKelasId)) {
      const waliUser = await User.findById(waliKelasId).lean()
      if (waliUser) {
        waliKelas = {
          id: waliUser._id.toString(),
          name: waliUser.name,
          noInduk: waliUser.noInduk,
        }
      }
    }

    const enrollmentsRaw = await Enrollment.find({
      $or: [{ classId: kelas._id }, { Class: kelas._id }],
    }).lean()
    const enrollments = enrollmentsRaw.map(normalizeLegacyEnrollment)
    const studentIds = Array.from(new Set(enrollments.map((e: any) => e.studentId?.toString()).filter(Boolean)))
    const students = studentIds.length > 0 ? await User.find({ _id: { $in: studentIds } }).lean() : []
    const studentMap = new Map(students.map((student) => [student._id.toString(), student]))

    const siswa = enrollments.map((enrollment: any) => {
      const student = enrollment.studentId ? studentMap.get(enrollment.studentId.toString()) : null
      return {
        id: student?._id?.toString() ?? '',
        name: student?.name ?? '-',
        noInduk: student?.noInduk ?? '-',
      }
    })

    const classSubjectsRaw = await ClassSubject.find({
      $or: [{ classId: kelas._id }, { Class: kelas._id }],
    }).lean()
    const classSubjects = classSubjectsRaw.map(normalizeLegacyClassSubject)
    const subjectIds = Array.from(new Set(classSubjects.map((item: any) => item.subjectId?.toString()).filter(Boolean)))
    const teacherIds = Array.from(new Set(classSubjects.map((item: any) => item.guruPengajar?.toString()).filter(Boolean)))

    const [subjects, teachers] = await Promise.all([
      subjectIds.length > 0 ? Subject.find({ _id: { $in: subjectIds } }).lean() : [],
      teacherIds.length > 0 ? User.find({ _id: { $in: teacherIds } }).lean() : [],
    ])

    const subjectMap = new Map(subjects.map((subject) => [subject._id.toString(), subject]))
    const teacherMap = new Map(teachers.map((teacher) => [teacher._id.toString(), teacher]))

    const jadwal = classSubjects.map((item: any) => {
      const subject = item.subjectId ? subjectMap.get(item.subjectId.toString()) : null
      const guruPengajar = item.guruPengajar ? teacherMap.get(item.guruPengajar.toString()) : null
      return {
        id: item._id?.toString() ?? '',
        subject: subject
          ? {
              id: subject._id.toString(),
              namaMataPelajaran: subject.namaMataPelajaran,
            }
          : null,
        guruPengajar: guruPengajar
          ? {
              id: guruPengajar._id.toString(),
              name: guruPengajar.name,
              noInduk: guruPengajar.noInduk,
            }
          : null,
        hari: item.hari,
        jamMulai: item.jamMulai,
        jamSelesai: item.jamSelesai,
        ruangKelas: item.ruangKelas,
      }
    })

    const assignmentsRaw = await Assignment.find({
      $or: [{ classId: kelas._id }, { Class: kelas._id }],
    }).lean()
    const assignments = assignmentsRaw.map(normalizeLegacyAssignment)
    const assignmentSubjectIds = Array.from(new Set(assignments.map((item: any) => item.mataPelajaran?.toString()).filter(Boolean)))
    const assignmentTeacherIds = Array.from(new Set(assignments.map((item: any) => item.teacherId?.toString()).filter(Boolean)))

    const [assignmentSubjects, assignmentTeachers] = await Promise.all([
      assignmentSubjectIds.length > 0 ? Subject.find({ _id: { $in: assignmentSubjectIds } }).lean() : [],
      assignmentTeacherIds.length > 0 ? User.find({ _id: { $in: assignmentTeacherIds } }).lean() : [],
    ])

    const assignmentSubjectMap = new Map(assignmentSubjects.map((subject) => [subject._id.toString(), subject]))
    const assignmentTeacherMap = new Map(assignmentTeachers.map((teacher) => [teacher._id.toString(), teacher]))

    const tugas = assignments.map((assignment: any) => {
      const subject = assignment.mataPelajaran ? assignmentSubjectMap.get(assignment.mataPelajaran.toString()) : null
      const teacher = assignment.teacherId ? assignmentTeacherMap.get(assignment.teacherId.toString()) : null
      return {
        id: assignment._id?.toString() ?? '',
        judul: assignment.judul || '',
        deskripsi: assignment.deskripsi ?? '',
        deadline: assignment.deadline
          ? new Date(assignment.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
          : '-',
        mataPelajaran: subject
          ? {
              id: subject._id.toString(),
              namaMataPelajaran: subject.namaMataPelajaran,
            }
          : null,
        guru: teacher
          ? {
              id: teacher._id.toString(),
              name: teacher.name,
              noInduk: teacher.noInduk,
            }
          : null,
      }
    })

    const responseData = {
      kelas: {
        id: kelas._id.toString(),
        namaKelas: normalizedKelas.namaKelas || '',
        jurusan: normalizedKelas.jurusan || '',
        angkatan: normalizedKelas.angkatan || '',
        waliKelas,
      },
      siswa,
      jadwal,
      tugas,
    }

    return NextResponse.json({ success: true, data: responseData })
  } catch (error) {
    console.error('API Guru Kelas Error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
