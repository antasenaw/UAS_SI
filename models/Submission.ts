import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
  Assignment: mongoose.Types.ObjectId;
  Student: mongoose.Types.ObjectId;
  attachment: string[];
  status: 'Submitted' | 'Late' | 'Missing' | 'Reviewed';
  score: number;
  created_at: Date;
  updated_at: Date;
}

const SubmissionScheme = new Schema<ISubmission>(
  {
    Assignment: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      required: [true, 'Tugas harus ada']
    },
    Student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Siswa harus ada']
    },
    attachment: [{
      type: String,
      trim: true
    }],
    status: {
      type: String,
      enum: {
        values: ['Submitted', 'Late', 'Missing', 'Reviewed'],
        message: 'Status harus Submitted, Late, Missing, Reviewed'
      },
      default: 'Submitted'
    },
    score: {
      type: Number,
      min: [0, 'Nilai tidak boleh negatif']
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

export default mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionScheme);