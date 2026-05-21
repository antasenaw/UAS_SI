import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmissionFile {
  nama: string;
  url: string;
  tipe?: string;
  ukuran?: string;
}

export interface ISubmission extends Document {
  assignmentId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  files: ISubmissionFile[];
  tanggalSubmit: Date;
  status: 'Draft' | 'Submitted' | 'Graded';
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    files: {
      type: [
        {
          nama: { type: String, required: true },
          url: { type: String, required: true },
          tipe: { type: String },
          ukuran: { type: String },
        },
      ],
      default: [],
    },
    tanggalSubmit: { type: Date, default: Date.now },
    status: { type: String, enum: ['Draft', 'Submitted', 'Graded'], default: 'Submitted' },
  },
  { timestamps: true }
);

export default mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);