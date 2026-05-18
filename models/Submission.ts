import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
  assignmentId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  file: string;
  tanggalSubmit: Date;
  status: 'Draft' | 'Submitted' | 'Graded';
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    file: { type: String, required: true },
    tanggalSubmit: { type: Date, default: Date.now },
    status: { type: String, enum: ['Draft', 'Submitted', 'Graded'], default: 'Submitted' },
  },
  { timestamps: true }
);

export default mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);