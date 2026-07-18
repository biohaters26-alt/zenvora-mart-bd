"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function AddToCartBox({ product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState(product.variants?.[0]?.value || "");
  const [added, setAdded] = useState(false);

  const outOfStock = product.stock <= 0;

  const handleAdd = () => {
    addItem({
      productId: product._id,
      name: product.name,
      image: product.images?.[0],
      price: product.price,
      quantity,
      variant
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAdd();
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col gap-4">
      {product.variants?.length > 0 && (
        <div>
          <p className="text-xs text-white/50 mb-2">Variant</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.value}
                onClick={() => setVariant(v.value)}
                className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                  variant === v.value
                    ? "border-cyan-glow bg-cyan-glow/10 text-cyan-glow"
                    : "border-white/10 text-white/60"
                }`}
              >
                {v.value}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <p className="text-xs text-white/50">Quantity</p>
        <div className="flex items-center border border-white/10 rounded-lg">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-9 h-9 text-white/70 hover:text-cyan-glow"
          >
            −
          </button>
          <span className="w-10 text-center text-sm text-white">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
            className="w-9 h-9 text-white/70 hover:text-cyan-glow"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={handleAdd} disabled={outOfStock} className="btn-outline flex-1 disabled:opacity-40">
          {added ? "Added ✓" : "Add to Cart"}
        </button>
        <button onClick={handleBuyNow} disabled={outOfStock} className="btn-primary flex-1 disabled:opacity-40">
          Buy Now
        </button>
      </div>
    </div>
  );
}
