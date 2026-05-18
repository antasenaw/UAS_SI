import mongoose from 'mongoose';
import connectDB from '../lib/mongodb';

async function listCollections() {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    if (!db) {
      console.log('Database connection not established.');
      process.exit(1);
    }
    const collections = await db.listCollections().toArray();
    console.log('Available collections in database:');
    collections.forEach(col => console.log(`- ${col.name}`));
    process.exit(0);
  } catch (err: any) {
    console.error('Failed to list collections:', err.message);
    process.exit(1);
  }
}

listCollections();
