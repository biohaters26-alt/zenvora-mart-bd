/**
 * Pure function to calculate discount for a coupon against a subtotal.
 * Used by both the /api/coupons/validate route and the checkout page
 * for optimistic client-side recalculation.
 */
export function calculateDiscount(coupon, subtotal) {
  if (!coupon || !coupon.isActive) {
    return { valid: false, discount: 0, message: "Invalid or inactive coupon." };
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, discount: 0, message: "This coupon has expired." };
  }

  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, discount: 0, message: "This coupon has reached its usage limit." };
  }

  if (coupon.minOrderAmount > 0 && subtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum order amount for this coupon is ৳${coupon.minOrderAmount}.`
    };
  }

  let discount = 0;
  if (coupon.type === "percentage") {
    discount = (subtotal * coupon.value) / 100;
    if (coupon.maxDiscountAmount > 0) {
      discount = Math.min(discount, coupon.maxDiscountAmount);
    }
  } else {
    discount = coupon.value;
  }

  discount = Math.min(discount, subtotal);
  discount = Math.round(discount * 100) / 100;

  return { valid: true, discount, message: "Coupon applied successfully!" };
}
