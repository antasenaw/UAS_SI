import connectDB from '../lib/mongodb';
import User from '../models/User';
import ClassSubject from '../models/ClassSubject';
import ClassModel from '../models/Class';
import Enrollment from '../models/Enrollment';
import Grade from '../models/Grade';
import Material from '../models/Material';
import Assignment from '../models/Assignment';
import Subject from '../models/Subject';
import mongoose from 'mongoose';

async function main() {
  await connectDB();
  const guru = await User.findOne({ role: 'Guru' }).lean();
  if (!guru) {
    console.error('No Guru found');
    process.exit(1);
  }
  const teacherId = new mongoose.Types.ObjectId(guru._id);
  const classSubjects = await ClassSubject.find({ $or: [{ guruPengajar: teacherId }, { Teacher: teacherId }] }).lean();
  console.log('Guru:', { name: guru.name, id: guru._id.toString() });
  console.log('ClassSubject count:', classSubjects.length);

  const normalized = classSubjects.map((cs) => {
    if (cs.Class && !cs.classId) cs.classId = cs.Class;
    if (cs.Subject && !cs.subjectId) cs.subjectId = cs.Subject;
    if (cs.Teacher && !cs.guruPengajar) cs.guruPengajar = cs.Teacher;
    return cs;
  });

  const classIds = normalized.map((cs) => cs.classId).filter(Boolean);
  const studentEnrollments = classIds.length > 0 ? await Enrollment.find({ classId: { $in: classIds } }).lean() : [];
  const grades = await Grade.find({ teacherId: guru._id }).lean();

  const populatedClasses = await Promise.all(normalized.map(async (cs) => {
    const classDoc = await ClassModel.findById(cs.classId).lean();
    const subjectDoc = cs.subjectId ? await Subject.findById(cs.subjectId).lean() : null;
    const studentCount = studentEnrollments.filter(e => e.classId.toString() === classDoc?._id.toString()).length;
    let topikTerbaru = 'Belum ada materi terbaru';
    if (subjectDoc) {
      const material = await Material.findOne({ teacherId: guru._id, mataPelajaran: subjectDoc._id }).sort({ tanggalUpload: -1 }).lean();
      if (material) {
        topikTerbaru = material.judul;
      } else {
        const assignment = await Assignment.findOne({ teacherId: guru._id, mataPelajaran: subjectDoc._id }).sort({ deadline: -1 }).lean();
        if (assignment) {
          topikTerbaru = assignment.judul;
        }
      }
    }
    return {
      id: cs._id,
      nama: `${classDoc?.angkatan || ''} ${classDoc?.jurusan || ''} ${classDoc?.namaKelas || ''}`.trim(),
      jumlahSiswa: studentCount,
      mataPelajaran: subjectDoc?.namaMataPelajaran || '-',
      topikTerbaru,
    };
  }));

  console.log('Populated classes count:', populatedClasses.length);
  console.log(JSON.stringify(populatedClasses.slice(0, 5), null, 2));

  const avgGrade = grades.length > 0 ? grades.reduce((acc, curr) => acc + (curr.nilai || 0), 0) / grades.length : 0;
  console.log('Avg grade:', avgGrade);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
