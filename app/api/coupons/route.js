import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 403 });
    }

    await connectDB();
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, coupons });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Failed to fetch coupons." }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();

    if (!body.code || !body.value || !body.type) {
      return NextResponse.json(
        { success: false, message: "Code, type and value are required." },
        { status: 400 }
      );
    }

    const existing = await Coupon.findOne({ code: body.code.toUpperCase() });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "A coupon with this code already exists." },
        { status: 409 }
      );
    }

    const coupon = await Coupon.create({ ...body, code: body.code.toUpperCase() });

    return NextResponse.json({ success: true, coupon }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Failed to create coupon." }, { status: 500 });
  }
}
