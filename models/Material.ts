import mongoose, { Schema, Document } from 'mongoose';

export interface IMaterial extends Document {
  ClassSubject: mongoose.Types.ObjectId;
  title: string;
  description: string;
  attachment: string[];
  created_at: Date;
  updated_at: Date;
}

const MaterialScheme = new Schema<IMaterial>(
  {
    ClassSubject: {
      type: Schema.Types.ObjectId,
      ref: 'ClassSubject',
      required: [true, 'Mapel dan kelas harus ada']
    },
    title: {
      type: String,
      required: [true, 'Judul materi harus ada'],
      trim: true,
      maxlength: [100, 'Judul maksimal 100 karakter'],
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

export default mongoose.models.Material || mongoose.model<IMaterial>('Material', MaterialScheme);