import mongoose, { Schema, Document } from 'mongoose';

export interface IClassSubject extends Document {
  Class: mongoose.Types.ObjectId;
  Subject: mongoose.Types.ObjectId;
  Teacher: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const ClassSubjectSchema = new Schema<IClassSubject>(
  {
    Class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Kelas harus ada']
    },
    Subject: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Mapel harus ada']
    },
    Teacher: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Guru harus ada']
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

export default mongoose.models.ClassSubject || mongoose.model<IClassSubject>('ClassSubject', ClassSubjectSchema);