"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const STEPS = ["pending", "confirmed", "shipped", "delivered"];

const STEP_LABELS = {
  pending: "Order Placed",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered"
};

function TrackOrderInner() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get("order") || "";

  const [orderNumber, setOrderNumber] = useState(initialOrder);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrder = async (num) => {
    if (!num.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(num.trim())}`);
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Order not found. Please check your order number.");
        return;
      }

      setOrder(data.order);
    } catch (err) {
      setError("Failed to fetch order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrder) fetchOrder(initialOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialOrder]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchOrder(orderNumber);
  };

  const isCancelled = order?.status === "cancelled";
  const currentStepIndex = STEPS.indexOf(order?.status);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="section-title text-center mb-2">Track Your Order</h1>
      <p className="text-white/50 text-center mb-8 text-sm">
        Enter your order number (e.g. ZVM-A1B2C3D4) to see the latest status.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-10">
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
          placeholder="Enter Order Number"
          className="input-field flex-1"
        />
        <button type="submit" disabled={loading} className="btn-primary shrink-0 disabled:opacity-50">
          {loading ? "Searching..." : "Track"}
        </button>
      </form>

      {error && (
        <div className="glass-panel p-6 text-center text-red-300 text-sm mb-8">{error}</div>
      )}

      {order && (
        <div className="glass-panel p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-8">
            <div>
              <p className="text-xs text-white/40">Order Number</p>
              <p className="font-display font-bold text-white text-lg">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/40">Placed On</p>
              <p className="text-sm text-white/80">
                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })}
              </p>
            </div>
          </div>

          {isCancelled ? (
            <div className="badge bg-red-500/10 text-red-300 border border-red-500/30 mb-8">
              This order has been cancelled
            </div>
          ) : (
            <div className="flex items-center justify-between mb-10 relative">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-white/10 -z-0" />
              <div
                className="absolute top-4 left-0 h-0.5 bg-gradient-to-r from-cyan-glow to-emerald-glow -z-0 transition-all duration-500"
                style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
              />
              {STEPS.map((step, i) => (
                <div key={step} className="relative z-10 flex flex-col items-center gap-2 flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                      i <= currentStepIndex
                        ? "bg-gradient-to-br from-cyan-glow to-emerald-glow text-charcoal-950 border-transparent"
                        : "bg-charcoal-900 border-white/20 text-white/30"
                    }`}
                  >
                    {i <= currentStepIndex ? "✓" : i + 1}
                  </div>
                  <span
                    className={`text-[11px] text-center ${
                      i <= currentStepIndex ? "text-white" : "text-white/30"
                    }`}
                  >
                    {STEP_LABELS[step]}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">Shipping Address</h3>
              <p className="text-sm text-white/60">{order.shipping.fullName}</p>
              <p className="text-sm text-white/60">{order.shipping.phone}</p>
              <p className="text-sm text-white/60">{order.shipping.fullAddress}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">Payment</h3>
              <p className="text-sm text-white/60">Method: {order.paymentMethod.toUpperCase()}</p>
              <p className="text-sm text-white/60">Status: {order.paymentStatus}</p>
              <p className="text-sm font-bold text-emerald-soft mt-1">Total: ৳{order.total}</p>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-white mb-3">Items</h3>
          <div className="flex flex-col gap-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm text-white/60">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>৳{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="text-center py-24 text-white/50">Loading...</div>}>
      <TrackOrderInner />
    </Suspense>
  );
}
