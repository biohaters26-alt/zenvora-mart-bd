"use client";

import Image from "next/image";
import Link from "next/link";
import StarRating from "./StarRating";
import OrderActions from "./OrderActions";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const discountPct =
    product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem({
      productId: product._id,
      name: product.name,
      image: product.images?.[0],
      price: product.price,
      quantity: 1,
      variant: ""
    });
  };

  return (
    <div className="glass-card flex flex-col overflow-hidden group">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden">
        <Image
          src={product.images?.[0] || "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {discountPct > 0 && (
          <span className="absolute top-3 left-3 badge bg-emerald-glow text-charcoal-950 font-bold">
            -{discountPct}%
          </span>
        )}
        {product.stock <= 0 && (
          <span className="absolute inset-0 bg-charcoal-950/70 flex items-center justify-center text-white font-semibold text-sm">
            Out of Stock
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <span className="text-[11px] uppercase tracking-wide text-cyan-soft/70">{product.category}</span>
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-semibold text-white line-clamp-2 hover:text-cyan-glow transition-colors">
            {product.name}
          </h3>
        </Link>

        <StarRating rating={product.ratingAverage} count={product.ratingCount} />

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-lg font-bold text-emerald-soft">৳{product.price}</span>
          {product.compareAtPrice > product.price && (
            <span className="text-xs text-white/40 line-through">৳{product.compareAtPrice}</span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="btn-outline !py-2 text-xs mt-1 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add to Cart
        </button>

        <div className="mt-2 pt-2 border-t border-white/[0.06]">
          <OrderActions productName={product.name} layout="col" />
        </div>
      </div>
    </div>
  );
}
