import mongoose, { Schema, Document } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  created_at: Date;
  updated_at: Date;
}

const SubjectSchema = new Schema<ISubject>(
  {
    name: {
      type: String,
      required: [true, 'Nama mapel wajib diisi'],
      unique: true,
      trim: true,
      maxlength: [50, 'Nama mapel maksimal 50 karakter']
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

export default mongoose.models.Subject || mongoose.model<ISubject>('Subject', SubjectSchema);