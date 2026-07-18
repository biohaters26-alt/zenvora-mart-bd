import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const { productId, rating, comment, name } = body;

    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { success: false, message: "Product, rating and comment are required." },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await getCurrentUser();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });
    }

    const review = await Review.create({
      product: productId,
      user: user?._id,
      name: user?.name || name || "Verified Customer",
      rating,
      comment,
      isVerifiedPurchase: !!user
    });

    const stats = await Review.aggregate([
      { $match: { product: product._id } },
      { $group: { _id: "$product", avg: { $avg: "$rating" }, count: { $sum: 1 } } }
    ]);

    if (stats.length) {
      product.ratingAverage = Math.round(stats[0].avg * 10) / 10;
      product.ratingCount = stats[0].count;
      await product.save();
    }

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Failed to submit review." }, { status: 500 });
  }
}
