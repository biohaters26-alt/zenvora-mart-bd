import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(req, { params }) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();
    const coupon = await Coupon.findByIdAndUpdate(params.id, body, { new: true });

    if (!coupon) {
      return NextResponse.json({ success: false, message: "Coupon not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, coupon });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Failed to update coupon." }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 403 });
    }

    await connectDB();
    const deleted = await Coupon.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Coupon not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Coupon deleted." });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Failed to delete coupon." }, { status: 500 });
  }
}
