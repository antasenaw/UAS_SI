import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Submission from "@/models/Submission";
import fs from 'fs'
import path from 'path'

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get('assignmentId');
    const studentId = searchParams.get('studentId');

    let query: any = {};
    if (assignmentId) query.assignmentId = assignmentId;
    if (studentId) query.studentId = studentId;

    const submissions = await Submission.find(query)
      .populate('assignmentId', 'judul')
      .populate('studentId', 'name noInduk');
    return NextResponse.json({ success: true, data: submissions });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const contentType = request.headers.get('content-type') || ''

    // Handle multipart/form-data (file uploads from student form)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const assignmentId = formData.get('assignmentId')?.toString() || ''
      const studentId = formData.get('studentId')?.toString() || ''
      const tanggalSubmit = formData.get('tanggalSubmit')?.toString() || undefined
      const status = formData.get('status')?.toString() || 'Submitted'

      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }

      const files: any[] = []
      let fileCount = 0

      // iterate formData entries to find file fields
      for (const [key, value] of formData.entries()) {
        if (key !== 'file' || !value) continue

        fileCount++
        try {
          const file = value as File
          const fileName = file.name || `upload-${Date.now()}-${fileCount}`
          const ext = path.extname(fileName)
          const safeName = `${Date.now()}-${fileCount}${ext}`.replace(/[^a-zA-Z0-9._-]/g, '_')

          // Convert File to Buffer
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)

          // Write file to disk
          const dest = path.join(uploadDir, safeName)
          fs.writeFileSync(dest, buffer)

          // Verify file was written
          if (fs.existsSync(dest)) {
            const fileSize = fs.statSync(dest).size
            files.push({
              nama: file.name || fileName,
              url: `/uploads/${safeName}`,
              tipe: file.type || '',
              ukuran: `${fileSize}`,
            })
            console.log(`[SUBMISSION] File saved: ${dest} (${fileSize} bytes)`)
          } else {
            console.error(`[SUBMISSION] File write failed: ${dest}`)
          }
        } catch (err) {
          console.error(`[SUBMISSION] Error processing file #${fileCount}:`, err)
        }
      }

      const payload: any = {
        assignmentId,
        studentId,
        files: files.length > 0 ? files : [],
        tanggalSubmit: tanggalSubmit ? new Date(tanggalSubmit) : new Date(),
        status,
      }

      console.log(`[SUBMISSION] Creating submission with ${files.length} files for student ${studentId}`)
      const newSubmission = await Submission.create(payload)
      return NextResponse.json({ success: true, data: newSubmission }, { status: 201 })
    }

    // Fallback for JSON body
    const body = await request.json();
    const newSubmission = await Submission.create(body);
    return NextResponse.json({ success: true, data: newSubmission }, { status: 201 });
  } catch (error: any) {
    console.error('[SUBMISSION] POST Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { id, status, file } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Submission id is required' }, { status: 400 });
    }

    const update: any = {};
    if (status) update.status = status;
    if (file) update.file = file;

    const submission = await Submission.findByIdAndUpdate(id, update, { new: true });

    return NextResponse.json({ success: true, data: submission });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
