import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

const uri = "mongodb://127.0.0.1:27017";

const client = new MongoClient(uri);

const DB_NAME = "uas_si";

function generateNIP(index) {
  return `19870${String(index).padStart(12, "0")}`;
}

function generateNIS(index) {
  return `2026${String(index).padStart(6, "0")}`;
}

async function main() {
  await client.connect();

  const db = client.db(DB_NAME);

  console.log("Hapus users lama...");

  await db.collection("users").deleteMany({});

  const users = [];

  const adminPassword = await bcrypt.hash("admin123", 10);
  const guruPassword = await bcrypt.hash("guru123", 10);
  const siswaPassword = await bcrypt.hash("siswa123", 10);

  // ================= ADMIN =================

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

  // ================= GURU =================

  for (let i = 1; i <= 45; i++) {
    users.push({
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
    });
  }

  // ================= SISWA =================

  for (let i = 1; i <= 900; i++) {
    users.push({
      _id: new ObjectId(),
      name: faker.person.fullName(),
      email: `siswa${i}@school.id`,
      password_hash: siswaPassword,
      noInduk: generateNIS(i),
      role: "Siswa",
      status: "Aktif",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  await db.collection("users").insertMany(users);

  console.log("=======================");
  console.log("USERS RESEEDED");
  console.log("=======================");
  console.log("Total Users:", users.length);

  await client.close();
}

main().catch(console.error);