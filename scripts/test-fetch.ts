import mongoose from 'mongoose';
import connectDB from '../lib/mongodb';
import ClassModel from '../models/Class';
import User from '../models/User';

async function testFetch() {
  try {
    await connectDB();
    console.log('Fetching classes...');
    const classes = await ClassModel.find().populate('Wali_kelas', 'name');
    console.log(`Found ${classes.length} classes.`);
    
    classes.forEach(c => {
      console.log(`- Class: ${c.grade} ${c.major} ${c.section}`);
      console.log(`  Wali Kelas: ${c.Wali_kelas ? (c.Wali_kelas as any).name : 'None'}`);
    });

    console.log('Fetching users...');
    const users = await User.find().limit(5);
    console.log(`Found ${users.length} users (limited to 5).`);
    users.forEach(u => {
      console.log(`- User: ${u.name} (${u.role})`);
    });

    process.exit(0);
  } catch (err: any) {
    console.error('Error during fetch:', err.message);
    process.exit(1);
  }
}

testFetch();
