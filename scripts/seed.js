import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

const DB_NAME = "uas_si";

const HARI = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

const SLOT_JAM = [
  ["07:00", "08:30"],
  ["08:30", "10:00"],
  ["10:15", "11:45"],
  ["13:00", "14:30"],
];

const GENERAL_SUBJECTS = [
  "Agama",
  "PPKN",
  "Sejarah",
  "Olahraga",
  "Bahasa Indonesia",
  "Bahasa Inggris",
  "Seni Budaya",
  "Matematika Wajib",
];

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getGrade(nilai) {
  if (nilai >= 90) return "A";
  if (nilai >= 80) return "B";
  if (nilai >= 70) return "C";
  return "D";
}

function generateNIP(index) {
  return `19870${String(index).padStart(12, "0")}`;
}

function generateNIS(index) {
  return `2026${String(index).padStart(6, "0")}`;
}

async function main() {
  try {
    await client.connect();

    const db = client.db(DB_NAME);

    console.log("Menghapus collection lama...");

    const collections = [
      "users",
      "classes",
      "subjects",
      "class_subjects",
      "enrollments",
      "materials",
      "assignments",
      "submissions",
      "grades",
      "periods",
    ];

    for (const col of collections) {
      try {
        await db.collection(col).drop();
      } catch (err) { }
    }

    // =========================
    // USERS
    // =========================

    const users = [];
    const guruList = [];
    const siswaList = [];

    const adminPassword = await bcrypt.hash("admin123", 10);
    const guruPassword = await bcrypt.hash("guru123", 10);
    const siswaPassword = await bcrypt.hash("siswa123", 10);

    console.log("Generate Admin...");

    for (let i = 1; i <= 5; i++) {
      users.push({
        _id: new ObjectId(),
        name: `Admin ${i}`,
        email: `admin${i}@school.id`,
        password_hash: adminPassword,
        noInduk: `ADM${String(i).padStart(3, "0")}`,
        role: "Admin",
        status: "Aktif",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    console.log("Generate Guru...");

    for (let i = 1; i <= 45; i++) {
      const guru = {
        _id: new ObjectId(),
        name: faker.person.fullName(),
        email: `guru${i}@school.id`,
        password_hash: guruPassword,
        noInduk: generateNIP(i),
        role: "Guru",
        status: "Aktif",
        isWaliKelas: i <= 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      guruList.push(guru);
      users.push(guru);
    }

    console.log("Generate Siswa...");

    for (let i = 1; i <= 900; i++) {
      const siswa = {
        _id: new ObjectId(),
        name: faker.person.fullName(),
        email: `siswa${i}@school.id`,
        password_hash: siswaPassword,
        noInduk: generateNIS(i),
        role: "Siswa",
        status: "Aktif",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      siswaList.push(siswa);
      users.push(siswa);
    }

    await db.collection("users").insertMany(users);

    console.log("Users inserted:", users.length);

    // =========================
    // PERIODS
    // =========================

    const periods = [
      {
        _id: new ObjectId(),
        nama: "Semester Ganjil",
        tahunAjaran: "2025/2026",
        semester: 1,
        aktif: true,
      },
      {
        _id: new ObjectId(),
        nama: "Semester Genap",
        tahunAjaran: "2025/2026",
        semester: 2,
        aktif: false,
      },
    ];

    await db.collection("periods").insertMany(periods);

    // =========================
    // SUBJECTS
    // =========================

    const subjectDocs = [];

    const addSubject = (nama, kategori, jurusan, kode) => {

      const guru =
        guruList[randomBetween(0, guruList.length - 1)];

      subjectDocs.push({
        _id: new ObjectId(),
        namaMataPelajaran: nama,
        kode,
        kategori,
        jurusan,
        deskripsi: `Mata pelajaran ${nama}`,
        status: "Aktif",
        pengampu: guru._id,
        createdAt: new Date(),
      });
    };

    GENERAL_SUBJECTS.forEach((s, i) => {
      addSubject(s, "Umum", "Semua", `UMM${i + 1}`);
    });

    ["Biologi", "Fisika", "Kimia", "Matematika Peminatan"].forEach(
      (s, i) => {
        addSubject(s, "Peminatan", "IPA", `IPA${i + 1}`);
      }
    );

    ["Ekonomi", "Sosiologi", "Sejarah Peminatan", "Geografi"].forEach(
      (s, i) => {
        addSubject(s, "Peminatan", "IPS", `IPS${i + 1}`);
      }
    );

    await db.collection("subjects").insertMany(subjectDocs);

    // =========================
    // CLASSES
    // =========================

    const classes = [];

    const angkatanMap = [
      { label: "X", tahun: 2026 },
      { label: "XI", tahun: 2025 },
      { label: "XII", tahun: 2024 },
    ];

    let waliIndex = 0;

    angkatanMap.forEach((angkatan) => {
      for (let i = 1; i <= 6; i++) {
        classes.push({
          _id: new ObjectId(),
          namaKelas: `${angkatan.label} IPA ${i}`,
          jurusan: "IPA",
          angkatan: angkatan.tahun,
          waliKelas: guruList[waliIndex]._id,
          kapasitas: 30,
          status: "Aktif",
          createdAt: new Date(),
        });

        waliIndex++;
      }

      for (let i = 1; i <= 4; i++) {
        classes.push({
          _id: new ObjectId(),
          namaKelas: `${angkatan.label} IPS ${i}`,
          jurusan: "IPS",
          angkatan: angkatan.tahun,
          waliKelas: guruList[waliIndex]._id,
          kapasitas: 30,
          status: "Aktif",
          createdAt: new Date(),
        });

        waliIndex++;
      }
    });

    await db.collection("classes").insertMany(classes);

    // =========================
    // ENROLLMENTS
    // =========================

    const enrollments = [];

    let siswaIndex = 0;

    for (const kelas of classes) {
      for (let i = 0; i < 30; i++) {
        enrollments.push({
          _id: new ObjectId(),
          studentId: siswaList[siswaIndex]._id,
          classId: kelas._id,
          tanggalDaftar: new Date(),
          status: "Aktif",
        });

        siswaIndex++;
      }
    }

    await db.collection("enrollments").insertMany(enrollments);

    // =========================
    // CLASS SUBJECTS
    // =========================

    const classSubjects = [];

    const teacherMap = {};

    // Assign guru tetap per subject
    for (const subject of subjectDocs) {
      const guru =
        guruList[randomBetween(0, guruList.length - 1)];

      teacherMap[subject._id.toString()] = guru._id;
    }

    let roomCounter = 1;

    for (const kelas of classes) {
      const allowedSubjects = subjectDocs.filter((s) => {
        if (s.jurusan === "Semua") return true;
        return s.jurusan === kelas.jurusan;
      });

      let dayIndex = 0;
      let slotIndex = 0;

      for (const subject of allowedSubjects) {
        const teacherId =
          teacherMap[subject._id.toString()];

        const hari = HARI[dayIndex % HARI.length];

        const jamMulai = SLOT_JAM[slotIndex][0];
        const jamSelesai = SLOT_JAM[slotIndex][1];

        classSubjects.push({
          _id: new ObjectId(),
          classId: kelas._id,
          subjectId: subject._id,
          guruPengajar: teacherId,
          hari,
          jamMulai,
          jamSelesai,
          ruangKelas: `R-${roomCounter}`,
          status: "Aktif",
          createdAt: new Date(),
        });

        slotIndex++;

        if (slotIndex >= SLOT_JAM.length) {
          slotIndex = 0;
          dayIndex++;
        }
      }

      roomCounter++;
    }

    await db
      .collection("class_subjects")
      .insertMany(classSubjects);

    // =========================
    // ASSIGNMENTS
    // =========================

    const assignments = [];

    for (const cs of classSubjects) {
      const subject = subjectDocs.find(
        (s) =>
          s._id.toString() ===
          cs.subjectId.toString()
      );

      for (let i = 1; i <= 5; i++) {
        const deadline = new Date();

        deadline.setDate(
          deadline.getDate() + randomBetween(3, 30)
        );

        assignments.push({
          _id: new ObjectId(),

          judul: `Tugas ${subject.namaMataPelajaran} ${i}`,

          deskripsi: `Kerjakan tugas ${subject.namaMataPelajaran} pertemuan ${i}`,

          mataPelajaran: subject._id,

          classId: cs.classId,

          teacherId: cs.guruPengajar,

          deadline,

          status: "Aktif",

          createdAt: new Date(),
        });
      }
    }

    await db
      .collection("assignments")
      .insertMany(assignments);

    // =========================
    // SUBMISSIONS
    // =========================

    const submissions = [];

    for (const assignment of assignments) {
      const classEnrollments =
        enrollments.filter(
          (e) =>
            e.classId.toString() ===
            assignment.classId.toString()
        );

      for (const enr of classEnrollments) {
        const rand = Math.random();

        let status = "Terkumpul";

        if (rand < 0.1) {
          status = "Belum Mengumpulkan";
        } else if (rand < 0.25) {
          status = "Terlambat";
        }

        submissions.push({
          _id: new ObjectId(),

          assignmentId: assignment._id,

          studentId: enr.studentId,

          file:
            status === "Belum Mengumpulkan"
              ? null
              : `submission_${enr.studentId}.pdf`,

          tanggalSubmit:
            status === "Belum Mengumpulkan"
              ? null
              : faker.date.recent({ days: 15 }),

          status,

          createdAt: new Date(),
        });
      }
    }

    await db
      .collection("submissions")
      .insertMany(submissions);

    // =========================
    // GRADES
    // =========================

    const grades = [];

    for (const enr of enrollments) {
      const kelas = classes.find(
        (c) =>
          c._id.toString() ===
          enr.classId.toString()
      );

      const allowedSubjects =
        subjectDocs.filter((s) => {
          if (s.jurusan === "Semua") {
            return true;
          }

          return s.jurusan === kelas.jurusan;
        });

      for (const subject of allowedSubjects) {
        const nilai = randomBetween(65, 100);

        const cs = classSubjects.find(
          (x) =>
            x.classId.toString() ===
            kelas._id.toString() &&
            x.subjectId.toString() ===
            subject._id.toString()
        );

        grades.push({
          _id: new ObjectId(),

          studentId: enr.studentId,

          subjectId: subject._id,

          classId: kelas._id,

          nilai,

          grade: getGrade(nilai),

          teacherId: cs.guruPengajar,

          createdAt: new Date(),
        });
      }
    }

    await db
      .collection("grades")
      .insertMany(grades);

    console.log(
      "Grades:",
      grades.length
    );

    console.log(
      "Submissions:",
      submissions.length
    );

    console.log(
      "Assignments:",
      assignments.length
    );

    console.log(
      "Class Subjects:",
      classSubjects.length
    );

    console.log("Enrollments:", enrollments.length);

    console.log("=======================");
    console.log("SEED SUCCESS");
    console.log("=======================");

    console.log("Users:", users.length);
    console.log("Classes:", classes.length);
    console.log("Subjects:", subjectDocs.length);
    console.log("Enrollments:", enrollments.length);
    console.log("Periods:", periods.length);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();