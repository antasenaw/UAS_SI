import mongoose from 'mongoose';
import User from '../models/User';
import ClassModel from '../models/Class';
import Subject from '../models/Subject';
import Period from '../models/Period';
import Enrollment from '../models/Enrollment';
import ClassSubject from '../models/ClassSubject';
import bcrypt from 'bcryptjs';

const MONGO_URI = 'mongodb://localhost:27017/uas_si';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await ClassModel.deleteMany({});
    await Subject.deleteMany({});
    await Period.deleteMany({});
    await Enrollment.deleteMany({});
    await ClassSubject.deleteMany({});

    // Create Admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin Sistem',
      email: 'admin@school.com',
      password_hash: hashedPassword,
      noInduk: 'ADM001',
      role: 'Admin',
      status: 'Aktif'
    });

    // Create Guru
    const guru1 = await User.create({
      name: 'Pak Budi Hartono, S.Pd',
      email: 'budi@teacher.com',
      password_hash: hashedPassword,
      noInduk: 'GURU001',
      role: 'Guru',
      status: 'Aktif',
      bidangStudi: 'Matematika'
    });

    const guru2 = await User.create({
      name: 'Ibu Siti Aminah, M.Pd',
      email: 'siti@teacher.com',
      password_hash: hashedPassword,
      noInduk: 'GURU002',
      role: 'Guru',
      status: 'Aktif',
      bidangStudi: 'Bahasa Indonesia'
    });

    // Create Siswa
    const siswa1 = await User.create({
      name: 'Rizky Pratama',
      email: 'rizky@student.com',
      password_hash: hashedPassword,
      noInduk: '123456',
      role: 'Siswa',
      status: 'Aktif'
    });

    const siswa2 = await User.create({
      name: 'Anisa Putri',
      email: 'anisa@student.com',
      password_hash: hashedPassword,
      noInduk: '123457',
      role: 'Siswa',
      status: 'Aktif'
    });

    // Create Period
    const period = await Period.create({
      name: '2025/2026 Ganjil',
      year: { start: 2025, end: 2026 },
      semester: 'Ganjil',
      isActive: true
    });

    // Create Class
    const kelasX = await ClassModel.create({
      grade: '10',
      major: 'IPA',
      section: 'A',
      Wali_kelas: guru1._id
    });

    // Create Subject
    const math = await Subject.create({
      name: 'Matematika',
      kode: 'MAT01',
      kategori: 'umum'
    });

    // Enrollment
    await Enrollment.create({
      Student: siswa1._id,
      Class: kelasX._id,
      Period: period._id
    });

    // ClassSubject
    await ClassSubject.create({
      Class: kelasX._id,
      Subject: math._id,
      Teacher: guru1._id
    });

    console.log('Seed completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
