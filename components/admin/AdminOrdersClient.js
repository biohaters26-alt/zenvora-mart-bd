"use client";

import { useState } from "react";

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const STATUS_COLORS = {
  pending: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
  confirmed: "bg-cyan-glow/10 text-cyan-soft border-cyan-glow/30",
  shipped: "bg-blue-500/10 text-blue-300 border-blue-500/30",
  delivered: "bg-emerald-glow/10 text-emerald-soft border-emerald-glow/30",
  cancelled: "bg-red-500/10 text-red-300 border-red-500/30"
};

export default function AdminOrdersClient({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const handleStatusChange = async (orderId, status) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (data.success) {
      setOrders((prev) => prev.map((o) => (o._id === orderId ? data.order : o)));
    }
  };

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="section-title">Manage Orders</h1>
        <div className="flex gap-2 flex-wrap">
          {["all", ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-colors ${
                filter === s ? "bg-cyan-glow text-charcoal-950 font-semibold" : "glass-card text-white/60"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {filteredOrders.map((order) => (
          <div key={order._id} className="glass-panel p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-white font-semibold">{order.orderNumber}</p>
                <p className="text-xs text-white/40">
                  {order.shipping.fullName} · {order.shipping.phone}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-emerald-soft font-bold">৳{order.total}</span>
                <span className={`badge ${STATUS_COLORS[order.status]} capitalize`}>{order.status}</span>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="input-field !py-1.5 !px-2 text-xs w-auto"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                  className="text-xs text-cyan-soft hover:text-cyan-glow"
                >
                  {expanded === order._id ? "Hide" : "Details"}
                </button>
              </div>
            </div>

            {expanded === order._id && (
              <div className="mt-4 pt-4 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs uppercase text-white/40 mb-2">Items</h4>
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm text-white/70 mb-1">
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>৳{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="text-xs uppercase text-white/40 mb-2">Shipping & Payment</h4>
                  <p className="text-sm text-white/70">{order.shipping.fullAddress}</p>
                  <p className="text-sm text-white/70 mt-1">
                    Payment: {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
                  </p>
                  {order.paymentTransactionId && (
                    <p className="text-sm text-white/70">TxnID: {order.paymentTransactionId}</p>
                  )}
                  {order.couponCode && (
                    <p className="text-sm text-emerald-soft mt-1">Coupon used: {order.couponCode}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="glass-panel p-10 text-center text-white/40">No orders found for this filter.</div>
        )}
      </div>
    </div>
  );
}
