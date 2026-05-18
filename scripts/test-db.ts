import mongoose from 'mongoose';
import connectDB from '../lib/mongodb';
import User from '../models/User';
import ClassModel from '../models/Class';

async function diagnose() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await connectDB();
    console.log('Connected successfully.');

    const userCount = await User.countDocuments();
    console.log(`Total users in 'users' collection: ${userCount}`);

    if (userCount > 0) {
      const sampleUser = await User.findOne().lean();
      console.log('Sample user from DB:', JSON.stringify(sampleUser, null, 2));
    }

    const classCount = await ClassModel.countDocuments();
    console.log(`Total classes in 'classes' collection: ${classCount}`);

    process.exit(0);
  } catch (err: any) {
    console.error('Database connection or query failed:', err.message);
    process.exit(1);
  }
}

diagnose();
