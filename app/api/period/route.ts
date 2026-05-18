import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Period from "@/models/Period";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active');

    if (activeOnly === 'true') {
      const activePeriod = await Period.findOne({ aktif: true });
      return NextResponse.json({ success: true, data: activePeriod });
    }

    const periods = await Period.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: periods });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch periods' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    if (body.aktif) {
      await Period.updateMany({}, { aktif: false });
    }

    const newPeriod = await Period.create(body);
    return NextResponse.json({ success: true, data: newPeriod }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
