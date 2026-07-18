import Link from "next/link";
import { STORE_NAME, ORDER_PHONE_DISPLAY } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/[0.06] bg-charcoal-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-glow to-emerald-glow flex items-center justify-center font-display font-bold text-charcoal-950">
              Z
            </span>
            <span className="font-display font-bold text-white">{STORE_NAME}</span>
          </div>
          <p className="text-sm text-white/50">
            Premium gadgets, curated for Bangladesh. Fast delivery, secure payments, and trusted quality.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">Shop</h4>
          <ul className="space-y-2 text-sm text-white/50">
            <li><Link href="/products" className="hover:text-cyan-glow">All Products</Link></li>
            <li><Link href="/products?featured=true" className="hover:text-cyan-glow">Featured</Link></li>
            <li><Link href="/orders/track" className="hover:text-cyan-glow">Track Order</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">Support</h4>
          <ul className="space-y-2 text-sm text-white/50">
            <li>Call / WhatsApp: {ORDER_PHONE_DISPLAY}</li>
            <li>Payments: bKash, Nagad, Cash on Delivery</li>
            <li>Delivery: Nationwide across Bangladesh</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">Newsletter</h4>
          <p className="text-sm text-white/50 mb-3">Get updates on new drops & offers.</p>
          <div className="flex gap-2">
            <input placeholder="Your email" className="input-field !py-2 text-sm" />
            <button className="btn-primary !py-2 !px-4 text-sm shrink-0">Join</button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.06] py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} {STORE_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
