import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import jwt from 'jsonwebtoken'
import Notification from '@/models/Notification'
import User from '@/models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

async function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
  if (!token) return null
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    await connectDB()
    return await User.findById(decoded.userId)
  } catch (err) {
    return null
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const user = await getUserFromRequest(req)
    if (!user) return NextResponse.json({ success: true, data: [] })

    const notifs = await Notification.find({ userId: user._id }).sort({ createdAt: -1 }).lean()
    const data = notifs.map((n) => ({
      id: n._id.toString(),
      title: n.title,
      message: n.message,
      time: n.createdAt.toISOString(),
      read: !!n.read,
      link: n.link || null,
    }))
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('Notifications GET error', err)
    return NextResponse.json({ success: false, data: [] }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const user = await getUserFromRequest(req)
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { id, action } = body || {}
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 })

    if (action === 'markAllRead') {
      await Notification.updateMany({ userId: user._id, read: false }, { $set: { read: true } })
      return NextResponse.json({ success: true })
    }

    // mark single as read
    await Notification.updateOne({ _id: id, userId: user._id }, { $set: { read: true } })
    return NextResponse.json({ success: true, id })
  } catch (err) {
    console.error('Notifications POST error', err)
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
  }
}
