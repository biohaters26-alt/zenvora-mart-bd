import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import AdminOrdersClient from "@/components/admin/AdminOrdersClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 }).lean();

  return <AdminOrdersClient initialOrders={JSON.parse(JSON.stringify(orders))} />;
}
