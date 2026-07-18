export const STORE_NAME = "Zenvora Mart BD";

// Mandatory contact number for "Order Now" quick actions
export const ORDER_PHONE_DISPLAY = "01754222891";
export const ORDER_PHONE_INTL = "8801754222891"; // for wa.me / tel: links

export const COMPARE_URL =
  "https://www.rokomari.com/electronics/445804/buy-airpods-a9-pro-anc-touch-screen-display-earbuds-with-tom-and-jerry-random-key-ring-any-one-free?fbclid=IwY2xjawTA3IRleHRuA2FlbQMxMDAAc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHqZOKyGm4GMDcsUBJwQqtc8WW-uBQ8U_3itfc82bNjCApPvkQiC367L3sKEG_aem__ARECIdW4jFb_ZSFYKL3yQ";

export function buildWhatsAppOrderLink(productName) {
  const text = encodeURIComponent(
    `Hi Zenvora Mart BD! I want to order: ${productName}. Please confirm price & availability.`
  );
  return `https://wa.me/${ORDER_PHONE_INTL}?text=${text}`;
}

export function buildTelLink() {
  return `tel:${ORDER_PHONE_DISPLAY}`;
}

export const SHIPPING_FEE_INSIDE_DHAKA = 70;
export const SHIPPING_FEE_OUTSIDE_DHAKA = 130;
export const FREE_SHIPPING_THRESHOLD = 2500;

export const CATEGORIES = [
  { name: "Earbuds & Audio", slug: "earbuds-audio", icon: "headphones" },
  { name: "Smart Watches", slug: "smart-watches", icon: "watch" },
  { name: "Mobile Accessories", slug: "mobile-accessories", icon: "smartphone" },
  { name: "Home Gadgets", slug: "home-gadgets", icon: "home" },
  { name: "Gaming Gear", slug: "gaming-gear", icon: "gamepad" },
  { name: "Power & Charging", slug: "power-charging", icon: "battery-charging" }
];
