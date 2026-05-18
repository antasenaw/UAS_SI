import mongoose, { Schema, Document } from 'mongoose';

export interface IClassSubject extends Document {
  classId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  guruPengajar: mongoose.Types.ObjectId;
  ruangKelas: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClassSubjectSchema = new Schema<IClassSubject>(
  {
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    hari: { type: String, required: true },
    jamMulai: { type: String, required: true },
    jamSelesai: { type: String, required: true },
    guruPengajar: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ruangKelas: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.ClassSubject || mongoose.model<IClassSubject>('ClassSubject', ClassSubjectSchema);