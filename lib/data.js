import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Review from "@/models/Review";
import mongoose from "mongoose";

export async function getFeaturedProducts(limit = 8) {
  await connectDB();
  const products = await Product.find({ isActive: true, isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return JSON.parse(JSON.stringify(products));
}

export async function getNewArrivals(limit = 8) {
  await connectDB();
  const products = await Product.find({ isActive: true }).sort({ createdAt: -1 }).limit(limit).lean();
  return JSON.parse(JSON.stringify(products));
}

export async function getBestSellers(limit = 8) {
  await connectDB();
  const products = await Product.find({ isActive: true }).sort({ soldCount: -1 }).limit(limit).lean();
  return JSON.parse(JSON.stringify(products));
}

export async function getProductBySlug(slug) {
  await connectDB();
  const query = mongoose.isValidObjectId(slug) ? { _id: slug } : { slug };
  const product = await Product.findOne({ ...query, isActive: true }).lean();
  if (!product) return null;

  const [reviews, related] = await Promise.all([
    Review.find({ product: product._id }).sort({ createdAt: -1 }).lean(),
    Product.find({ category: product.category, _id: { $ne: product._id }, isActive: true }).limit(4).lean()
  ]);

  return JSON.parse(JSON.stringify({ product, reviews, related }));
}

export async function getProductsFiltered({ category, search, sort = "newest", page = 1, limit = 12 } = {}) {
  await connectDB();
  const query = { isActive: true };
  if (category && category !== "all") query.category = category;
  if (search) query.$text = { $search: search };

  let sortOption = { createdAt: -1 };
  if (sort === "price_asc") sortOption = { price: 1 };
  if (sort === "price_desc") sortOption = { price: -1 };
  if (sort === "top_rated") sortOption = { ratingAverage: -1 };
  if (sort === "best_selling") sortOption = { soldCount: -1 };

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return JSON.parse(
    JSON.stringify({ products, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } })
  );
}
