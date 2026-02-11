import mongoose, { Schema, Document } from 'mongoose';

export interface IPeriod extends Document {
  name: string;
  year:
  {
    start: number,
    end: number
  };
  semester: 'Ganjil' | 'Genap';
  isActive: boolean;
  created_at: Date;
  updated_at: Date;
}

const PeriodScheme = new Schema<IPeriod>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Tahun ajaran harus diisi']
    },
    year :{
      start: {
        type: Number,
        min: [0, 'Tahun awal tidak boleh negatif'],
        required: [true, 'Tahun awal harus diisi']
      },
      end: {
        type: Number,
        min: [0, 'Tahun akhir tidak boleh negatif'],
        required: [true, 'Tahun akhir harus diisi']
      }
    },
    semester: {
      type: String,
      enum: ['Ganjil', 'Genap'],
      required: [true, 'Semester harus diisi']
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

export default mongoose.models.Period || mongoose.model<IPeriod>('Period', PeriodScheme);