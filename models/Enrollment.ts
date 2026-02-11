import mongoose, { Schema, Document } from 'mongoose';

export interface IEnrollment extends Document {
  Student: mongoose.Types.ObjectId;
  Class: mongoose.Types.ObjectId;
  Period: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const EnrollmentScheme = new Schema<IEnrollment>(
  {
    Student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    Class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true
    },
    Period: {
      type: Schema.Types.ObjectId,
      ref: 'Period',
      required: true
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

export default mongoose.models.Enrollment || mongoose.model<IEnrollment>('Enrollment', EnrollmentScheme);