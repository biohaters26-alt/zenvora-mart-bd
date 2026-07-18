"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import CouponBox from "@/components/CouponBox";
import { trackPurchase } from "@/lib/analytics";
import {
  SHIPPING_FEE_INSIDE_DHAKA,
  SHIPPING_FEE_OUTSIDE_DHAKA,
  FREE_SHIPPING_THRESHOLD
} from "@/lib/constants";

const BKASH_NUMBER = process.env.NEXT_PUBLIC_BKASH_NUMBER || "01754222891";
const NAGAD_NUMBER = process.env.NEXT_PUBLIC_NAGAD_NUMBER || "01754222891";

export default function CheckoutPage() {
  const { items, subtotal, coupon, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    district: "",
    area: "",
    fullAddress: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [transactionId, setTransactionId] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const isInsideDhaka = form.district.toLowerCase().includes("dhaka");
  const discount = coupon?.discount || 0;
  let shippingFee = isInsideDhaka ? SHIPPING_FEE_INSIDE_DHAKA : SHIPPING_FEE_OUTSIDE_DHAKA;
  if (subtotal >= FREE_SHIPPING_THRESHOLD) shippingFee = 0;
  const total = Math.max(subtotal + shippingFee - discount, 0);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.fullName || !form.phone || !form.fullAddress) {
      setError("Please fill in your name, phone number and full address.");
      return;
    }

    if (paymentMethod !== "cod" && !transactionId.trim()) {
      setError("Please enter your payment Transaction ID after sending money.");
      return;
    }

    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            quantity: i.quantity,
            variant: i.variant
          })),
          shipping: form,
          paymentMethod,
          paymentTransactionId: transactionId,
          couponCode: coupon?.code
        })
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to place order.");
        return;
      }

      trackPurchase({
        orderId: data.order.orderNumber,
        value: data.order.total,
        items: items.map((i) => ({ id: i.productId, quantity: i.quantity }))
      });

      clearCart();
      router.push(`/orders/track?order=${data.order.orderNumber}`);
    } catch (err) {
      setError("Something went wrong while placing your order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="section-title mb-3">Your cart is empty</h1>
        <p className="text-white/50">Add some products before checking out.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="section-title mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6">
            <h2 className="font-semibold text-white mb-4">Shipping Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                required
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange("fullName")}
                className="input-field"
              />
              <input
                required
                placeholder="Phone Number (e.g. 017XXXXXXXX)"
                value={form.phone}
                onChange={handleChange("phone")}
                className="input-field"
              />
              <input
                type="email"
                placeholder="Email (optional, for order confirmation)"
                value={form.email}
                onChange={handleChange("email")}
                className="input-field sm:col-span-2"
              />
              <input
                placeholder="District (e.g. Dhaka, Chattogram)"
                value={form.district}
                onChange={handleChange("district")}
                className="input-field"
              />
              <input
                placeholder="Area / Thana"
                value={form.area}
                onChange={handleChange("area")}
                className="input-field"
              />
              <textarea
                required
                placeholder="Full Delivery Address"
                value={form.fullAddress}
                onChange={handleChange("fullAddress")}
                rows={3}
                className="input-field sm:col-span-2 resize-none"
              />
            </div>
          </div>

          <div className="glass-panel p-6">
            <h2 className="font-semibold text-white mb-4">Payment Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <PaymentOption
                id="bkash"
                label="bKash"
                emoji="💳"
                color="from-pink-500/20 to-pink-500/5"
                selected={paymentMethod === "bkash"}
                onSelect={() => setPaymentMethod("bkash")}
              />
              <PaymentOption
                id="nagad"
                label="Nagad"
                emoji="🧡"
                color="from-orange-500/20 to-orange-500/5"
                selected={paymentMethod === "nagad"}
                onSelect={() => setPaymentMethod("nagad")}
              />
              <PaymentOption
                id="cod"
                label="Cash on Delivery"
                emoji="💵"
                color="from-emerald-glow/20 to-emerald-glow/5"
                selected={paymentMethod === "cod"}
                onSelect={() => setPaymentMethod("cod")}
              />
            </div>

            {(paymentMethod === "bkash" || paymentMethod === "nagad") && (
              <div className="mt-5 glass-card p-4">
                <p className="text-sm text-white/70">
                  Send <strong className="text-emerald-soft">৳{total.toFixed(0)}</strong> to{" "}
                  <strong className="text-white">
                    {paymentMethod === "bkash" ? BKASH_NUMBER : NAGAD_NUMBER}
                  </strong>{" "}
                  ({paymentMethod === "bkash" ? "bKash" : "Nagad"} Personal/Send Money), then enter the
                  Transaction ID below.
                </p>
                <input
                  required
                  placeholder="Transaction ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="input-field mt-3"
                />
              </div>
            )}

            {paymentMethod === "cod" && (
              <p className="text-xs text-white/50 mt-4">
                Pay in cash when your order arrives at your doorstep. A small delivery fee applies.
              </p>
            )}
          </div>
        </div>

        <div className="glass-panel p-6 h-fit sticky top-24">
          <h2 className="font-semibold text-white mb-4">Order Summary</h2>

          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto mb-4 pr-1">
            {items.map((item) => (
              <div key={`${item.productId}-${item.variant}`} className="flex justify-between text-xs text-white/60">
                <span className="truncate pr-2">
                  {item.name} × {item.quantity}
                </span>
                <span className="shrink-0">৳{(item.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
          </div>

          <CouponBox />

          <div className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between text-white/60">
              <span>Subtotal</span>
              <span>৳{subtotal.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Shipping</span>
              <span>{shippingFee === 0 ? "Free" : `৳${shippingFee}`}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-soft">
                <span>Discount</span>
                <span>−৳{discount.toFixed(0)}</span>
              </div>
            )}
            <div className="border-t border-white/[0.06] pt-3 flex justify-between text-white font-bold text-base">
              <span>Total</span>
              <span>৳{total.toFixed(0)}</span>
            </div>
          </div>

          {error && (
            <div className="mt-4 text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              {error}
            </div>
          )}

          <button type="submit" disabled={placing} className="btn-primary w-full mt-6 disabled:opacity-50">
            {placing ? "Placing Order..." : `Place Order — ৳${total.toFixed(0)}`}
          </button>
        </div>
      </form>
    </div>
  );
}

function PaymentOption({ label, emoji, color, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`glass-card p-4 flex flex-col items-center gap-2 bg-gradient-to-br ${color} ${
        selected ? "border-cyan-glow shadow-glow" : ""
      }`}
    >
      <span className="text-2xl">{emoji}</span>
      <span className="text-sm font-semibold text-white">{label}</span>
    </button>
  );
}
