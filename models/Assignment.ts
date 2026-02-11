import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
  ClassSubject: mongoose.Types.ObjectId;
  title: string;
  description: string;
  dueDate: Date;
  //TODO: add assignment types along with weight (tugas, ulangan, kuis, uts, uas)
  attachment: string[];
  created_at: Date;
  updated_at: Date;
}

const AssignmentScheme = new Schema<IAssignment>(
  {
    ClassSubject: {
      type: Schema.Types.ObjectId,
      ref: 'ClassSubject',
      required: [true, 'Kelas dan mapel harus ada']
    },
    title: {
      type: String,
      required: [true, 'Judul harus ada'],
      trim: true,
      maxlength: [100, 'Judul maximal 100 karakter']
    },
    description: {
      type: String,
      trim: true
    },
    attachment: [{
      type: String,
      trim: true
    }]
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

export default mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentScheme);