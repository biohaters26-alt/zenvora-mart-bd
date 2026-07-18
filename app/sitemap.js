import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { CATEGORIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  await connectDB();
  const products = await Product.find({ isActive: true }).select("slug updatedAt").lean();

  const staticRoutes = ["", "/products", "/cart", "/checkout", "/orders/track", "/login", "/register"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: route === "" ? 1 : 0.7
    })
  );

  const categoryRoutes = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/products?category=${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.6
  }));

  const productRoutes = products.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
