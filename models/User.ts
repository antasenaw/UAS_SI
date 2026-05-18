import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password_hash: string;
  noInduk: string;
  role: 'Admin' | 'Guru' | 'Siswa';
  status: 'Aktif' | 'Nonaktif';
  isWaliKelas: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password_hash: { type: String, required: true, select: false },
    noInduk: { type: String, required: true, unique: true, trim: true },
    role: { type: String, enum: ['Admin', 'Guru', 'Siswa'], required: true },
    status: { type: String, enum: ['Aktif', 'Nonaktif'], default: 'Aktif' },
    isWaliKelas: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);