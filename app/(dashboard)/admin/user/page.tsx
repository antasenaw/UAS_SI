import AdminUserClient from './AdminUserClient';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export default async function AdminUserPage() {
  await connectDB();
  const users = await User.find({}).select('-password_hash').lean();
  
  // Convert _id to string for serialization
  const serializedUsers = JSON.parse(JSON.stringify(users));

  return (
    <>
      <AdminUserClient usersList={serializedUsers} />
    </>
  );
}
