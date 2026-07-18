import { connectDB } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";
import AdminCouponsClient from "@/components/admin/AdminCouponsClient";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  await connectDB();
  const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();

  return <AdminCouponsClient initialCoupons={JSON.parse(JSON.stringify(coupons))} />;
}
