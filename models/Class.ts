import mongoose, { Schema, Document } from 'mongoose';

export interface IClass extends Document {
  namaKelas: string;
  jurusan: string;
  angkatan: string;
  waliKelas: mongoose.Types.ObjectId;
  kapasitas: number;
  status: 'Aktif' | 'Nonaktif';
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema = new Schema<IClass>(
  {
    namaKelas: { type: String, required: true, trim: true },
    jurusan: { type: String, required: true, trim: true },
    angkatan: { type: String, required: true, trim: true },
    waliKelas: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    kapasitas: { type: Number, default: 36 },
    status: { type: String, enum: ['Aktif', 'Nonaktif'], default: 'Aktif' },
  },
  { timestamps: true }
);

export default mongoose.models.Class || mongoose.model<IClass>('Class', ClassSchema);