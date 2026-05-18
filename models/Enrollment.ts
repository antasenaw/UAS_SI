import mongoose, { Schema, Document } from 'mongoose';

export interface IEnrollment extends Document {
  studentId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  tanggalDaftar: Date;
  status: 'Aktif' | 'Lulus' | 'Keluar';
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    tanggalDaftar: { type: Date, default: Date.now },
    status: { type: String, enum: ['Aktif', 'Lulus', 'Keluar'], default: 'Aktif' },
  },
  { timestamps: true }
);

export default mongoose.models.Enrollment || mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);