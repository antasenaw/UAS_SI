import mongoose, { Schema, Document } from 'mongoose';

export interface IGrade extends Document {
  //TODO: figure out the logic
  created_at: Date;
  updated_at: Date;
}

const GradeScheme = new Schema<IGrade>(
  {

  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

export default mongoose.models.Grade || mongoose.model<IGrade>('Grade', GradeScheme);