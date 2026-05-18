import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
  judul: string;
  deskripsi: string;
  mataPelajaran: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  deadline: Date;
  teacherId: mongoose.Types.ObjectId;
  status: 'Aktif' | 'Selesai';
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>(
  {
    judul: { type: String, required: true },
    deskripsi: { type: String },
    mataPelajaran: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    deadline: { type: Date, required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Aktif', 'Selesai'], default: 'Aktif' },
  },
  { timestamps: true }
);

export default mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentSchema);