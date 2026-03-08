import mongoose, { Schema, Document } from 'mongoose';

export interface IGrade extends Document {
  Student: mongoose.Types.ObjectId;
  ClassSubject: mongoose.Types.ObjectId;
  Period: mongoose.Types.ObjectId;
  assignmentScores: Array<{
    assignment: mongoose.Types.ObjectId;
    score: number;
    weight: number;
  }>;
  quizScores: Array<{
    quiz: mongoose.Types.ObjectId;
    score: number;
    weight: number;
  }>;
  midtermScore?: number;
  finalScore?: number;
  attendancePercentage?: number;
  finalGrade?: number;
  letterGrade?: 'A' | 'B' | 'C' | 'D' | 'E';
  gradeStatus: 'Passed' | 'Failed' | 'Incomplete';
  created_at: Date;
  updated_at: Date;
}

const GradeSchema = new Schema<IGrade>(
  {
    Student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Siswa harus ada']
    },
    ClassSubject: {
      type: Schema.Types.ObjectId,
      ref: 'ClassSubject',
      required: [true, 'Kelas dan Mapel harus ada']
    },
    Period: {
      type: Schema.Types.ObjectId,
      ref: 'Period',
      required: [true, 'Periode harus ada']
    },
    assignmentScores: [
      {
        assignment: {
          type: Schema.Types.ObjectId,
          ref: 'Assignment'
        },
        score: {
          type: Number,
          min: [0, 'Skor tidak boleh negatif'],
          max: [100, 'Skor maksimal 100']
        },
        weight: {
          type: Number,
          min: [0, 'Bobot tidak boleh negatif'],
          max: [1, 'Bobot maksimal 1 (100%)']
        }
      }
    ],
    quizScores: [
      {
        quiz: {
          type: Schema.Types.ObjectId,
          ref: 'Quiz'
        },
        score: {
          type: Number,
          min: [0, 'Skor tidak boleh negatif'],
          max: [100, 'Skor maksimal 100']
        },
        weight: {
          type: Number,
          min: [0, 'Bobot tidak boleh negatif'],
          max: [1, 'Bobot maksimal 1 (100%)']
        }
      }
    ],
    midtermScore: {
      type: Number,
      min: [0, 'Skor tidak boleh negatif'],
      max: [100, 'Skor maksimal 100']
    },
    finalScore: {
      type: Number,
      min: [0, 'Skor tidak boleh negatif'],
      max: [100, 'Skor maksimal 100']
    },
    attendancePercentage: {
      type: Number,
      min: [0, 'Persentase tidak boleh negatif'],
      max: [100, 'Persentase maksimal 100']
    },
    finalGrade: {
      type: Number,
      min: [0, 'Nilai akhir tidak boleh negatif'],
      max: [100, 'Nilai akhir maksimal 100']
    },
    letterGrade: {
      type: String,
      enum: {
        values: ['A', 'B', 'C', 'D', 'E'],
        message: 'Grade harus A, B, C, D, atau E'
      }
    },
    gradeStatus: {
      type: String,
      enum: {
        values: ['Passed', 'Failed', 'Incomplete'],
        message: 'Status harus Passed, Failed, atau Incomplete'
      },
      default: 'Incomplete'
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

// Compound index untuk unique combination
GradeSchema.index({ Student: 1, ClassSubject: 1, Period: 1 }, { unique: true });

export default mongoose.models.Grade || mongoose.model<IGrade>('Grade', GradeSchema);
