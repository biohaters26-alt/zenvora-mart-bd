"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CouponBox from "@/components/CouponBox";
import {
  SHIPPING_FEE_INSIDE_DHAKA,
  FREE_SHIPPING_THRESHOLD
} from "@/lib/constants";

export default function CartPage() {
  const { items, subtotal, coupon, updateQuantity, removeItem } = useCart();

  const discount = coupon?.discount || 0;
  const estimatedShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE_INSIDE_DHAKA;
  const total = Math.max(subtotal + estimatedShipping - discount, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="section-title mb-2">Your cart is empty</h1>
        <p className="text-white/50 mb-8">Looks like you haven't added anything yet.</p>
        <Link href="/products" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="section-title mb-8">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variant}`} className="glass-card p-4 flex gap-4">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                {item.variant && <p className="text-xs text-white/40">Variant: {item.variant}</p>}
                <p className="text-sm text-emerald-soft font-bold mt-1">৳{item.price}</p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-white/10 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.productId, item.variant, item.quantity - 1)}
                      className="w-8 h-8 text-white/70 hover:text-cyan-glow"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.variant, item.quantity + 1)}
                      className="w-8 h-8 text-white/70 hover:text-cyan-glow"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId, item.variant)}
                    className="text-xs text-red-300 hover:text-red-200"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="text-sm font-bold text-white shrink-0">
                ৳{(item.price * item.quantity).toFixed(0)}
              </div>
            </div>
          ))}
        </div>

        <div className="glass-panel p-6 h-fit sticky top-24">
          <h2 className="font-semibold text-white mb-4">Order Summary</h2>

          <CouponBox />

          <div className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between text-white/60">
              <span>Subtotal</span>
              <span>৳{subtotal.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Estimated Shipping</span>
              <span>{estimatedShipping === 0 ? "Free" : `৳${estimatedShipping}`}</span>
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

          <Link href="/checkout" className="btn-primary w-full mt-6">
            Proceed to Checkout
          </Link>
          <Link href="/products" className="block text-center text-xs text-cyan-soft mt-3 hover:text-cyan-glow">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
