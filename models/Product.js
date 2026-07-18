import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema(
  {
    name: String,
    value: String,
    priceModifier: { type: Number, default: 0 },
    stock: { type: Number, default: 0 }
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    brand: { type: String, default: "Zenvora" },
    category: { type: String, required: true, index: true },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    images: [{ type: String, required: true }],
    price: { type: Number, required: true },
    compareAtPrice: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    sku: { type: String, default: "" },
    variants: [VariantSchema],
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text", tags: "text" });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
