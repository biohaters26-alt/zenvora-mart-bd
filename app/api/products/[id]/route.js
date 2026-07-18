import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Review from "@/models/Review";
import { requireAdmin } from "@/lib/auth";

async function findProductByIdOrSlug(id) {
  if (mongoose.isValidObjectId(id)) {
    return Product.findById(id);
  }
  return Product.findOne({ slug: id });
}

export async function GET(req, { params }) {
  try {
    await connectDB();
    const product = await findProductByIdOrSlug(params.id).lean();

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });
    }

    const reviews = await Review.find({ product: product._id }).sort({ createdAt: -1 }).lean();

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    })
      .limit(4)
      .lean();

    return NextResponse.json({ success: true, product, reviews, related });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Failed to fetch product." }, { status: 500 });
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

    const product = await Product.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Failed to update product." }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 403 });
    }

    await connectDB();
    const deleted = await Product.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product deleted." });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Failed to delete product." }, { status: 500 });
  }
}
