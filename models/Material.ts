import mongoose, { Schema, Document } from 'mongoose';

export interface IMaterial extends Document {
  judul: string;
  deskripsi: string;
  mataPelajaran: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  file: string;
  tanggalUpload: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MaterialSchema = new Schema<IMaterial>(
  {
    judul: { type: String, required: true },
    deskripsi: { type: String },
    mataPelajaran: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    file: { type: String, required: true },
    tanggalUpload: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Material || mongoose.model<IMaterial>('Material', MaterialSchema);