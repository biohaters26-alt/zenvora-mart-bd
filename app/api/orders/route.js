import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";
import { getCurrentUser } from "@/lib/auth";
import { calculateDiscount } from "@/lib/coupon";
import {
  SHIPPING_FEE_INSIDE_DHAKA,
  SHIPPING_FEE_OUTSIDE_DHAKA,
  FREE_SHIPPING_THRESHOLD
} from "@/lib/constants";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { sendOrderConfirmationSMS } from "@/lib/sms";

export async function POST(req) {
  try {
    const body = await req.json();
    const { items, shipping, paymentMethod, paymentTransactionId, couponCode } = body;

    if (!items?.length || !shipping?.fullName || !shipping?.phone || !shipping?.fullAddress) {
      return NextResponse.json(
        { success: false, message: "Cart items and full shipping details are required." },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await getCurrentUser();

    // Re-verify prices & stock server-side (never trust client-sent prices)
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return NextResponse.json(
          { success: false, message: `Product "${item.name}" is no longer available.` },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { success: false, message: `Insufficient stock for "${product.name}".` },
          { status: 400 }
        );
      }

      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;

      verifiedItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || "",
        price: product.price,
        quantity: item.quantity,
        variant: item.variant || ""
      });
    }

    const isInsideDhaka = (shipping.district || "").toLowerCase().includes("dhaka");
    let shippingFee = isInsideDhaka ? SHIPPING_FEE_INSIDE_DHAKA : SHIPPING_FEE_OUTSIDE_DHAKA;
    if (subtotal >= FREE_SHIPPING_THRESHOLD) shippingFee = 0;

    let discount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (coupon) {
        const result = calculateDiscount(coupon, subtotal);
        if (result.valid) {
          discount = result.discount;
          appliedCoupon = coupon;
        }
      }
    }

    const total = Math.max(subtotal + shippingFee - discount, 0);

    const order = await Order.create({
      user: user?._id,
      guestEmail: !user ? shipping.email : undefined,
      items: verifiedItems,
      shipping,
      subtotal,
      shippingFee,
      discount,
      couponCode: appliedCoupon?.code || null,
      total,
      paymentMethod: paymentMethod || "cod",
      paymentTransactionId: paymentTransactionId || "",
      paymentStatus: paymentMethod === "cod" ? "unpaid" : "unpaid",
      status: "pending"
    });

    // Decrement stock & increment sold count
    for (const item of verifiedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, soldCount: item.quantity }
      });
    }

    // Increment coupon usage
    if (appliedCoupon) {
      appliedCoupon.usedCount += 1;
      await appliedCoupon.save();
    }

    // Fire-and-forget notifications (do not block the response)
    const notifyEmail = shipping.email || user?.email;
    sendOrderConfirmationEmail(order, notifyEmail).catch(() => {});
    sendOrderConfirmationSMS(order).catch(() => {});

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Failed to place order." }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const query = user.role === "admin" ? {} : { user: user._id };
    if (status && status !== "all") query.status = status;

    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, orders });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Failed to fetch orders." }, { status: 500 });
  }
}
