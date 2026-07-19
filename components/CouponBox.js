"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function CouponBox() {
  const { subtotal, coupon, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleApply = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), subtotal })
      });
      const data = await res.json();

      if (!data.success) {
        setMessage({ type: "error", text: data.message });
        return;
      }

      applyCoupon({ code: data.coupon.code, discount: data.discount });
      setMessage({ type: "success", text: data.message });
      setCode("");
    } catch (err) {
      setMessage({ type: "error", text: "Failed to validate coupon. Try again." });
    } finally {
      setLoading(false);
    }
  };

  if (coupon) {
    return (
      <div className="glass-card p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-soft">
            Coupon "{coupon.code}" applied
          </p>
          <p className="text-xs text-white/50">You saved ৳{coupon.discount}</p>
        </div>
        <button
          onClick={removeCoupon}
          className="text-xs text-red-300 hover:text-red-200 underline"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleApply(e);
            }
          }}
          placeholder="Enter promo code"
          className="input-field !py-2.5 flex-1"
        />
        <button type="button" onClick={handleApply} disabled={loading} className="btn-outline !py-2.5 shrink-0 disabled:opacity-50">
          {loading ? "Checking..." : "Apply"}
        </button>
      </div>
      {message && (
        <p className={`text-xs ${message.type === "error" ? "text-red-300" : "text-emerald-soft"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
