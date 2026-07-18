import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";

export const dynamic = "force-dynamic";

async function getStats() {
  await connectDB();

  const [totalProducts, totalOrders, totalUsers, orders, lowStock] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    User.countDocuments({ role: "customer" }),
    Order.find().sort({ createdAt: -1 }).limit(6).lean(),
    Product.find({ stock: { $lte: 5 } }).limit(5).lean()
  ]);

  const revenueAgg = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $group: { _id: null, total: { $sum: "$total" } } }
  ]);

  const pendingOrders = await Order.countDocuments({ status: "pending" });

  return {
    totalProducts,
    totalOrders,
    totalUsers,
    pendingOrders,
    revenue: revenueAgg[0]?.total || 0,
    recentOrders: JSON.parse(JSON.stringify(orders)),
    lowStock: JSON.parse(JSON.stringify(lowStock))
  };
}

export default async function AdminOverviewPage() {
  const stats = await getStats();

  const cards = [
    { label: "Total Revenue", value: `৳${stats.revenue.toFixed(0)}`, icon: "💰" },
    { label: "Total Orders", value: stats.totalOrders, icon: "🧾" },
    { label: "Pending Orders", value: stats.pendingOrders, icon: "⏳" },
    { label: "Total Products", value: stats.totalProducts, icon: "📦" },
    { label: "Registered Customers", value: stats.totalUsers, icon: "👥" }
  ];

  return (
    <div>
      <h1 className="section-title mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {cards.map((card) => (
          <div key={card.label} className="glass-card p-5">
            <div className="text-2xl mb-2">{card.icon}</div>
            <p className="text-xl font-bold text-white">{card.value}</p>
            <p className="text-xs text-white/50 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h2 className="font-semibold text-white mb-4">Recent Orders</h2>
          <div className="flex flex-col gap-3">
            {stats.recentOrders.length === 0 && (
              <p className="text-sm text-white/40">No orders yet.</p>
            )}
            {stats.recentOrders.map((order) => (
              <div key={order._id} className="flex justify-between items-center text-sm border-b border-white/[0.06] pb-2 last:border-none">
                <div>
                  <p className="text-white font-medium">{order.orderNumber}</p>
                  <p className="text-white/40 text-xs">{order.shipping.fullName}</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-soft font-bold">৳{order.total}</p>
                  <span className="text-xs text-white/50 capitalize">{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6">
          <h2 className="font-semibold text-white mb-4">Low Stock Alert</h2>
          <div className="flex flex-col gap-3">
            {stats.lowStock.length === 0 && (
              <p className="text-sm text-white/40">All products are well stocked.</p>
            )}
            {stats.lowStock.map((p) => (
              <div key={p._id} className="flex justify-between items-center text-sm border-b border-white/[0.06] pb-2 last:border-none">
                <p className="text-white">{p.name}</p>
                <span className="badge bg-red-500/10 text-red-300 border border-red-500/30">
                  {p.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
