"use client";

import { useState } from "react";
import { ORDER_PHONE_INTL } from "@/lib/constants";

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const message = encodeURIComponent("Hi Zenvora Mart BD! I need help with a product.");
  const link = `https://wa.me/${ORDER_PHONE_INTL}?text=${message}`;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="glass-panel w-72 p-4 animate-[float_0s] shadow-glow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-glow/20 flex items-center justify-center">
              <span className="text-lg">💬</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Zenvora Support</p>
              <p className="text-xs text-emerald-soft">Typically replies instantly</p>
            </div>
          </div>
          <p className="text-sm text-white/70 mb-4">
            Assalamu Alaikum! Need help choosing a product or tracking your order? Chat with us on WhatsApp.
          </p>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full !py-2.5 text-sm"
          >
            Start WhatsApp Chat
          </a>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-glow to-cyan-glow flex items-center justify-center shadow-glow animate-pulse-glow hover:scale-110 transition-transform"
        aria-label="Open WhatsApp chat"
      >
        <svg className="w-7 h-7 text-charcoal-950" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.42a9.87 9.87 0 004.62 1.17h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.06h-.01a8.2 8.2 0 01-4.18-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.16 8.16 0 01-1.26-4.4c0-4.52 3.68-8.2 8.24-8.2 2.2 0 4.27.86 5.83 2.42a8.16 8.16 0 012.41 5.8c0 4.52-3.68 8.23-8.24 8.23z" />
        </svg>
      </button>
    </div>
  );
}
