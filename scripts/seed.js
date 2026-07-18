/**
 * Seed script: creates an admin user, sample products across every category,
 * and a demo coupon. Run with: npm run seed
 */
require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set in .env.local. Aborting seed.");
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    role: { type: String, default: "customer" }
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    slug: { type: String, unique: true },
    brand: String,
    category: String,
    shortDescription: String,
    description: String,
    images: [String],
    price: Number,
    compareAtPrice: Number,
    stock: Number,
    sku: String,
    isFeatured: Boolean,
    isActive: { type: Boolean, default: true },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true },
    type: String,
    value: Number,
    minOrderAmount: Number,
    maxDiscountAmount: Number,
    usageLimit: Number,
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
const Product = mongoose.model("Product", ProductSchema);
const Coupon = mongoose.model("Coupon", CouponSchema);

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-");
}

const SAMPLE_PRODUCTS = [
  {
    name: "Zenvora A9 Pro ANC Touch Earbuds",
    category: "earbuds-audio",
    price: 1290,
    compareAtPrice: 2200,
    stock: 48,
    isFeatured: true,
    shortDescription: "Active Noise Cancellation, touch controls, deep bass, 30hr playtime.",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800",
      "https://images.unsplash.com/photo-1590658006821-11dbf7011672?w=800"
    ]
  },
  {
    name: "Zenvora Pulse Smart Watch Ultra",
    category: "smart-watches",
    price: 1890,
    compareAtPrice: 2900,
    stock: 30,
    isFeatured: true,
    shortDescription: "AMOLED display, heart-rate monitor, 7-day battery, IP68 waterproof.",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"]
  },
  {
    name: "Zenvora MagFast 65W GaN Charger",
    category: "power-charging",
    price: 990,
    compareAtPrice: 1500,
    stock: 60,
    isFeatured: true,
    shortDescription: "Compact GaN fast charger, 65W output, dual-port PD/QC support.",
    images: ["https://images.unsplash.com/photo-1591290619762-c8a2c0b4a1d1?w=800"]
  },
  {
    name: "Zenvora Aegis Phone Case (Shockproof)",
    category: "mobile-accessories",
    price: 350,
    compareAtPrice: 550,
    stock: 120,
    shortDescription: "Military-grade shockproof case with crystal clear back.",
    images: ["https://images.unsplash.com/photo-1601972602288-3be527b4f18a?w=800"]
  },
  {
    name: "Zenvora Nova RGB Gaming Mouse",
    category: "gaming-gear",
    price: 850,
    compareAtPrice: 1200,
    stock: 40,
    isFeatured: true,
    shortDescription: "6400 DPI optical sensor, customizable RGB, ergonomic grip.",
    images: ["https://images.unsplash.com/photo-1527814050087-3793815479db?w=800"]
  },
  {
    name: "Zenvora Halo Smart LED Bulb",
    category: "home-gadgets",
    price: 590,
    compareAtPrice: 890,
    stock: 75,
    shortDescription: "WiFi smart bulb, 16 million colors, works with Alexa & Google Home.",
    images: ["https://images.unsplash.com/photo-1550985616-10810253b84d?w=800"]
  },
  {
    name: "Zenvora AirFlow Bluetooth Headphones",
    category: "earbuds-audio",
    price: 1450,
    compareAtPrice: 2100,
    stock: 25,
    shortDescription: "Over-ear wireless headphones with 40hr battery and deep bass.",
    images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800"]
  },
  {
    name: "Zenvora FitTrack Band 5",
    category: "smart-watches",
    price: 990,
    compareAtPrice: 1450,
    stock: 55,
    shortDescription: "Slim fitness tracker with SpO2, sleep tracking, and 14-day battery.",
    images: ["https://images.unsplash.com/photo-1575311373937-6ee29e753dfb?w=800"]
  }
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB.");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@zenvoramart.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await User.create({
      name: "Zenvora Admin",
      email: adminEmail,
      password: hashed,
      role: "admin"
    });
    console.log(`Admin user created: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log("Admin user already exists, skipping.");
  }

  for (const p of SAMPLE_PRODUCTS) {
    const slug = slugify(p.name);
    const exists = await Product.findOne({ slug });
    if (exists) continue;

    await Product.create({
      ...p,
      slug,
      brand: "Zenvora",
      sku: `ZVM-${slug.slice(0, 6).toUpperCase()}`,
      description: `${p.shortDescription}\n\nBuilt for everyday performance, the ${p.name} combines premium materials with reliable functionality — designed for customers across Bangladesh who want quality without compromise.`,
      ratingAverage: 4.5,
      ratingCount: Math.floor(Math.random() * 40) + 5,
      soldCount: Math.floor(Math.random() * 200) + 10
    });
    console.log(`Product created: ${p.name}`);
  }

  const existingCoupon = await Coupon.findOne({ code: "ZENVORA10" });
  if (!existingCoupon) {
    await Coupon.create({
      code: "ZENVORA10",
      type: "percentage",
      value: 10,
      minOrderAmount: 500,
      maxDiscountAmount: 300,
      usageLimit: 0,
      isActive: true
    });
    console.log("Demo coupon created: ZENVORA10 (10% off, min order ৳500)");
  }

  console.log("Seeding complete.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
