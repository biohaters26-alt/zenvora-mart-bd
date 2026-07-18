import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductBySlug } from "@/lib/data";
import ProductGallery from "@/components/ProductGallery";
import AddToCartBox from "@/components/AddToCartBox";
import OrderActions from "@/components/OrderActions";
import StarRating from "@/components/StarRating";
import ReviewSection from "@/components/ReviewSection";
import ProductCard from "@/components/ProductCard";

export async function generateMetadata({ params }) {
  const data = await getProductBySlug(params.slug);
  if (!data) return { title: "Product Not Found" };
  const { product } = data;
  return {
    title: product.name,
    description: product.shortDescription || product.description?.slice(0, 150),
    openGraph: { images: product.images }
  };
}

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }) {
  const data = await getProductBySlug(params.slug);
  if (!data) return notFound();

  const { product, reviews, related } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="text-xs text-white/40 mb-6">
        Home / {product.category} / <span className="text-white/70">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <span className="badge-emerald mb-3">{product.category}</span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">{product.name}</h1>

          <div className="flex items-center gap-3 mt-3">
            <StarRating rating={product.ratingAverage} count={product.ratingCount} size="md" />
            <span className="text-white/30">|</span>
            <span className="text-sm text-white/50">{product.soldCount} sold</span>
          </div>

          <div className="flex items-baseline gap-3 mt-5">
            <span className="text-3xl font-bold text-emerald-soft">৳{product.price}</span>
            {product.compareAtPrice > product.price && (
              <span className="text-lg text-white/40 line-through">৳{product.compareAtPrice}</span>
            )}
          </div>

          <p className="text-white/60 text-sm mt-4 leading-relaxed">{product.shortDescription}</p>

          <div className="glass-panel p-5 mt-6">
            <AddToCartBox product={product} />
          </div>

          <div className="glass-panel p-5 mt-4">
            <p className="text-sm font-semibold text-white mb-3">Quick Order (Recommended)</p>
            <OrderActions productName={product.name} />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-white/50">
            <div className="glass-card p-3">🚚 Fast Delivery</div>
            <div className="glass-card p-3">🔒 Secure Payment</div>
            <div className="glass-card p-3">↩️ 7-Day Exchange</div>
          </div>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8">
          <h2 className="section-title !text-xl mb-4">Product Description</h2>
          <div className="text-white/70 text-sm leading-relaxed whitespace-pre-line">
            {product.description || "No detailed description available for this product yet."}
          </div>
        </div>

        <div className="glass-panel p-6">
          <h2 className="section-title !text-xl mb-4">Specifications</h2>
          <dl className="text-sm space-y-3">
            <div className="flex justify-between border-b border-white/[0.06] pb-2">
              <dt className="text-white/50">Brand</dt>
              <dd className="text-white/80">{product.brand}</dd>
            </div>
            <div className="flex justify-between border-b border-white/[0.06] pb-2">
              <dt className="text-white/50">SKU</dt>
              <dd className="text-white/80">{product.sku || "N/A"}</dd>
            </div>
            <div className="flex justify-between border-b border-white/[0.06] pb-2">
              <dt className="text-white/50">Stock</dt>
              <dd className="text-white/80">{product.stock > 0 ? `${product.stock} available` : "Out of stock"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/50">Category</dt>
              <dd className="text-white/80">{product.category}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-10">
        <ReviewSection productId={product._id} reviews={reviews} />
      </div>

      {related?.length > 0 && (
        <div className="mt-16">
          <h2 className="section-title mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
