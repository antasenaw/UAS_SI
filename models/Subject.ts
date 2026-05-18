import mongoose, { Schema, Document } from 'mongoose';

export interface ISubject extends Document {
  namaMataPelajaran: string;
  kode: string;
  kategori: 'Umum' | 'Peminatan';
  jurusan: string;
  deskripsi: string;
  status: 'Aktif' | 'Nonaktif';
  pengampu?: any;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema = new Schema<ISubject>(
  {
    namaMataPelajaran: { type: String, required: true, trim: true },
    kode: { type: String, required: true, unique: true, trim: true },
    kategori: { type: String, enum: ['Umum', 'Peminatan'], default: 'Umum' },
    jurusan: { type: String, required: true },
    deskripsi: { type: String, trim: true },
    status: { type: String, enum: ['Aktif', 'Nonaktif'], default: 'Aktif' },
    pengampu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
  },
  { timestamps: true }
);

// Force refresh model schema to apply changes like 'pengampu' field
if (mongoose.models.Subject) {
  delete (mongoose.models as any).Subject;
}

export default mongoose.model<ISubject>('Subject', SubjectSchema);