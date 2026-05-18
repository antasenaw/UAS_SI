import mongoose, { Schema, Document } from 'mongoose';

export interface IPeriod extends Document {
  nama: string;
  tahunAjaran: string;
  semester: 'Ganjil' | 'Genap';
  aktif: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PeriodSchema = new Schema<IPeriod>(
  {
    nama: { type: String, required: true },
    tahunAjaran: { type: String, required: true },
    semester: { type: String, enum: ['Ganjil', 'Genap'], required: true },
    aktif: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Period || mongoose.model<IPeriod>('Period', PeriodSchema);