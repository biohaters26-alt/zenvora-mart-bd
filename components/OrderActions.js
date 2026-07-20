"use client";

import { useState } from "react";
import { buildWhatsAppOrderLink, buildTelLink, COMPARE_URL, ORDER_PHONE_DISPLAY } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

export default function OrderActions({ productName = "this product", layout = "row", compareUrl, price }) {
  const finalCompareUrl = compareUrl && compareUrl.trim() ? compareUrl : COMPARE_URL;

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState(null);

  const waLink = appliedCoupon
    ? buildWhatsAppOrderLink(productName, {
        price,
        couponCode: appliedCoupon.code,
        discount: appliedCoupon.discount,
        finalPrice: appliedCoupon.finalPrice
      })
    : buildWhatsAppOrderLink(productName, price ? { price } : undefined);

  const handleOrderNow = () => {
    trackEvent("order_now_click", {
      product_name: productName,
      phone: ORDER_PHONE_DISPLAY,
      coupon: appliedCoupon ? appliedCoupon.code : undefined
    });
  };

  const handleCompare = () => {
    trackEvent("compare_before_buy_click", { product_name: productName });
  };

  const handleApplyCoupon = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!couponInput.trim() || !price) return;

    setCouponLoading(true);
    setCouponMessage(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput.trim(), subtotal: price })
      });
      const data = await res.json();

      if (!data.success) {
        setCouponMessage({ type: "error", text: data.message });
        setAppliedCoupon(null);
        return;
      }

      setAppliedCoupon({
        code: data.coupon.code,
        discount: data.discount,
        finalPrice: Math.max(price - data.discount, 0)
      });
      setCouponMessage({ type: "success", text: data.message });
    } catch (err) {
      setCouponMessage({ type: "error", text: "Failed to validate coupon. Try again." });
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponMessage(null);
    setCouponInput("");
  };

  return (
    <div className={`flex ${layout === "row" ? "flex-col sm:flex-row sm:items-center" : "flex-col"} gap-3`}>
      {typeof price === "number" && (
        <div className="flex flex-col gap-1">
          {appliedCoupon ? (
            <div className="glass-card p-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-emerald-soft">
                  Coupon "{appliedCoupon.code}" applied
                </p>
                <p className="text-xs text-white/50">
                  Final price: ৳{appliedCoupon.finalPrice} (saved ৳{appliedCoupon.discount})
                </p>
              </div>
              <button
                onClick={handleRemoveCoupon}
                className="text-xs text-red-300 hover:text-red-200 underline shrink-0"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleApplyCoupon(e);
                }}
                placeholder="Have a coupon code?"
                className="input-field !py-2 flex-1"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={couponLoading}
                className="btn-outline !py-2 shrink-0 disabled:opacity-50"
              >
                {couponLoading ? "Checking..." : "Apply"}
              </button>
            </div>
          )}
          {couponMessage && (
            <p className={`text-xs ${couponMessage.type === "error" ? "text-red-300" : "text-emerald-soft"}`}>
              {couponMessage.text}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-2">
        
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleOrderNow}
          className="btn-order-now"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.42a9.87 9.87 0 004.62 1.17h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.06h-.01a8.2 8.2 0 01-4.18-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.16 8.16 0 01-1.26-4.4c0-4.52 3.68-8.2 8.24-8.2 2.2 0 4.27.86 5.83 2.42a8.16 8.16 0 012.41 5.8c0 4.52-3.68 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.56.13-.17.25-.65.81-.79.97-.15.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.29z" />
          </svg>
          Order Now — {ORDER_PHONE_DISPLAY}
        </a>

        <a href={buildTelLink()} onClick={handleOrderNow} className="btn-outline !px-3" aria-label="Call to order">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
          </svg>
        </a>
      </div>

      
        href={finalCompareUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleCompare}
        className="link-compare"
      >
        ✅ Compare Before You Buy
      </a>
    </div>
  );
}
