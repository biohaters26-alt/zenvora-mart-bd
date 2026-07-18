import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const order = mongoose.isValidObjectId(id)
      ? await Order.findById(id).lean()
      : await Order.findOne({ orderNumber: id.toUpperCase() }).lean();

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Failed to fetch order." }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();

    const order = await Order.findById(params.id);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found." }, { status: 404 });
    }

    if (body.status && body.status !== order.status) {
      order.status = body.status;
      order.statusHistory.push({ status: body.status, note: body.note || "" });
    }
    if (body.paymentStatus) order.paymentStatus = body.paymentStatus;

    await order.save();

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Failed to update order." }, { status: 500 });
  }
}
