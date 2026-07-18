import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";
import { calculateDiscount } from "@/lib/coupon";

export async function POST(req) {
  try {
    const { code, subtotal } = await req.json();

    if (!code || subtotal === undefined) {
      return NextResponse.json(
        { success: false, message: "Coupon code and subtotal are required." },
        { status: 400 }
      );
    }

    await connectDB();
    const coupon = await Coupon.findOne({ code: code.toUpperCase() }).lean();

    if (!coupon) {
      return NextResponse.json({ success: false, message: "Invalid coupon code." }, { status: 404 });
    }

    const result = calculateDiscount(coupon, subtotal);

    if (!result.valid) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      discount: result.discount,
      message: result.message,
      coupon: { code: coupon.code, type: coupon.type, value: coupon.value }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Failed to validate coupon." }, { status: 500 });
  }
}
