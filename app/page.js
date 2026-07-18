import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import CategoryGrid from "@/components/CategoryGrid";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts, getNewArrivals, getBestSellers } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, newArrivals, bestSellers] = await Promise.all([
    getFeaturedProducts(8),
    getNewArrivals(8),
    getBestSellers(8)
  ]);

  return (
    <div className="pb-20">
      <HeroSlider />
      <CategoryGrid />

      <TrustBar />

      <ProductSection title="Featured Products" href="/products?featured=true" products={featured} />
      <ProductSection title="New Arrivals" href="/products?sort=newest" products={newArrivals} />
      <ProductSection title="Best Sellers" href="/products?sort=best_selling" products={bestSellers} />

      <NewsletterCTA />
    </div>
  );
}

function TrustBar() {
  const items = [
    { icon: "🚚", title: "Nationwide Delivery", desc: "Fast shipping across Bangladesh" },
    { icon: "🔒", title: "Secure Payments", desc: "bKash, Nagad & Cash on Delivery" },
    { icon: "↩️", title: "Easy Exchange", desc: "7-day hassle-free replacement" },
    { icon: "🎧", title: "24/7 Support", desc: "WhatsApp & call support" }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <div className="glass-panel grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/[0.06]">
        {items.map((item) => (
          <div key={item.title} className="p-5 text-center">
            <div className="text-2xl mb-2">{item.icon}</div>
            <p className="text-sm font-semibold text-white">{item.title}</p>
            <p className="text-xs text-white/50 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductSection({ title, href, products }) {
  if (!products?.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title">{title}</h2>
        <Link href={href} className="text-sm text-cyan-soft hover:text-cyan-glow">
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}

function NewsletterCTA() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
      <div className="glass-panel relative overflow-hidden p-10 sm:p-14 text-center">
        <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
        <div className="relative">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Elevate Your Everyday, One Gadget at a Time
          </h2>
          <p className="text-white/60 mt-3 max-w-xl mx-auto">
            Join thousands of happy customers across Bangladesh who trust Zenvora Mart BD for premium,
            affordable tech.
          </p>
          <Link href="/products" className="btn-primary mt-6 inline-flex">
            Start Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
