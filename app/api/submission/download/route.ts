import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get('file')

    if (!fileName) {
      console.error('[DOWNLOAD] No file parameter provided')
      return NextResponse.json({ success: false, error: 'File name required' }, { status: 400 })
    }

    // Sanitize filename to prevent directory traversal
    const safeName = path.basename(fileName)
    const filePath = path.join(process.cwd(), 'public', 'uploads', safeName)

    console.log(`[DOWNLOAD] Attempting to download: ${filePath}`)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`[DOWNLOAD] File not found: ${filePath}`)
      return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 })
    }

    // Read file and return with proper headers
    const fileBuffer = fs.readFileSync(filePath)
    const fileSize = fs.statSync(filePath).size
    const ext = path.extname(safeName).toLowerCase()

    console.log(`[DOWNLOAD] Serving file: ${safeName} (${fileSize} bytes)`)

    // Determine content type
    const contentTypeMap: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.ppt': 'application/vnd.ms-powerpoint',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      '.txt': 'text/plain',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.zip': 'application/zip',
    }

    const contentType = contentTypeMap[ext] || 'application/octet-stream'

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${safeName}"`,
        'Content-Length': fileSize.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error: any) {
    console.error('[DOWNLOAD] Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

