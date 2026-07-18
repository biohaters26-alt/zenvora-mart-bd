"use client";

export function trackEvent(eventName, params = {}) {
  if (typeof window === "undefined") return;

  // Google Analytics (gtag.js)
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }

  // Facebook Pixel
  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", eventName, params);
  }
}

export function trackPurchase({ orderId, value, currency = "BDT", items = [] }) {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", "purchase", {
      transaction_id: orderId,
      value,
      currency,
      items
    });
  }

  if (typeof window.fbq === "function") {
    window.fbq("track", "Purchase", { value, currency, content_ids: items.map((i) => i.id) });
  }
}
