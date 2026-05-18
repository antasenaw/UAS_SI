import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function checkDB() {
  if (!MONGO_URI) {
    console.error("MONGO_URI not found");
    return;
  }

  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  const db = mongoose.connection.db;
  if (!db) return;

  const collections = await db.listCollections().toArray();
  console.log("\nCollections in DB:");
  for (const col of collections) {
    const count = await db.collection(col.name).countDocuments();
    console.log(`- ${col.name}: ${count} documents`);
  }

  console.log("\nUser roles distribution:");
  const roles = await db.collection('users').aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } }
  ]).toArray();
  console.log(roles);

  console.log("\nSample Class fields:");
  const sampleClass = await db.collection('classes').findOne();
  console.log(sampleClass);

  await mongoose.disconnect();
}

checkDB();
