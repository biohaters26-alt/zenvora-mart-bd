import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import AdminProductsClient from "@/components/admin/AdminProductsClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 }).lean();

  return <AdminProductsClient initialProducts={JSON.parse(JSON.stringify(products))} />;
}
