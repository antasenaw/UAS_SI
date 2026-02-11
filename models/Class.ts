import mongoose, { Schema, Document } from 'mongoose';

export interface IClass extends Document {
  grade: string;
  major: string;
  section: string;
  Wali_kelas: mongoose.Types.ObjectId; 
  created_at: Date;
  updated_at: Date;
}

const ClassSchema = new Schema<IClass>(
  {
    grade: {
      type: String,
      required: [true, 'Angkatan wajib diisi'],
      trim: true,
      maxlength: 5
    },
    major: {
      type: String,
      required: [true, 'Jurusan wajib diisi'],
      trim: true,
      maxlength: 10
    },
    section: {
      type: String,
      required: [true, 'Jenis kelas wajib diisi'],
      trim: true,
      maxlength: 5
    },
    Wali_kelas: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Kelas harus memiliki wali kelas']
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

export default mongoose.models.Class || mongoose.model<IClass>('Class', ClassSchema);