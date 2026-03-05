import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password_hash: string;
  noInduk: string;
  role: 'Admin' | 'Guru' | 'Siswa';
  status: 'Aktif' | 'Nonaktif';
  created_at: Date;
  updated_at: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Nama wajib diisi'],
      trim: true,
      maxlength: [100, 'Nama maksimal 100 karakter'],
    },
    email: {
      type: String,
      required: [true, 'Wajib diisi'],
      trim: true,
        maxlength: [100, 'Maksimal 100 karakter'],
    },
    noInduk: {
      type: String,
      required: [true, 'Wajib diisi'],
      trim: true,
        maxlength: [100, 'Maksimal 100 karakter'],
    },
    password_hash: {
      type: String,
      required: [true, 'Password wajib diisi'],
      select: false, // Tidak include di query by default untuk keamanan
    },
    role: {
      type: String,
      enum: {
        values: ['Admin', 'Guru', 'Siswa'],
        message: 'Role harus Admin, Guru, atau Siswa',
      },
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ['Aktif', 'Nonaktif'],
        message: 'Role harus Aktif atau Nonaktif',
      },
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);