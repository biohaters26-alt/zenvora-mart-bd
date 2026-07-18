import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProductsFiltered } from "@/lib/data";
import { CATEGORIES } from "@/lib/constants";

export const metadata = {
  title: "Shop All Products",
  description: "Browse premium earbuds, smart watches, mobile accessories and gadgets at Zenvora Mart BD."
};

export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }) {
  const category = searchParams?.category || "all";
  const search = searchParams?.search || "";
  const sort = searchParams?.sort || "newest";
  const page = parseInt(searchParams?.page || "1", 10);

  const { products, pagination } = await getProductsFiltered({ category, search, sort, page, limit: 12 });

  const buildLink = (params) => {
    const merged = { category, search, sort, page: 1, ...params };
    const qs = new URLSearchParams(
      Object.entries(merged).filter(([, v]) => v && v !== "all")
    ).toString();
    return `/products${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="section-title">
          {search ? `Search results for "${search}"` : "All Products"}
        </h1>
        <p className="text-white/50 text-sm mt-1">{pagination.total} products found</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        <aside className="glass-panel p-5 h-fit sticky top-24">
          <h3 className="font-semibold text-white mb-3 text-sm uppercase tracking-wide">Categories</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link
                href={buildLink({ category: "all" })}
                className={`block px-3 py-2 rounded-lg transition-colors ${
                  category === "all" ? "bg-cyan-glow/10 text-cyan-glow" : "text-white/60 hover:text-white"
                }`}
              >
                All Products
              </Link>
            </li>
            {CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={buildLink({ category: cat.slug })}
                  className={`block px-3 py-2 rounded-lg transition-colors ${
                    category === cat.slug
                      ? "bg-cyan-glow/10 text-cyan-glow"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>

          <h3 className="font-semibold text-white mb-3 mt-6 text-sm uppercase tracking-wide">Sort By</h3>
          <ul className="space-y-1 text-sm">
            {[
              { key: "newest", label: "Newest" },
              { key: "price_asc", label: "Price: Low to High" },
              { key: "price_desc", label: "Price: High to Low" },
              { key: "top_rated", label: "Top Rated" },
              { key: "best_selling", label: "Best Selling" }
            ].map((opt) => (
              <li key={opt.key}>
                <Link
                  href={buildLink({ sort: opt.key })}
                  className={`block px-3 py-2 rounded-lg transition-colors ${
                    sort === opt.key ? "bg-cyan-glow/10 text-cyan-glow" : "text-white/60 hover:text-white"
                  }`}
                >
                  {opt.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div>
          {products.length === 0 ? (
            <div className="glass-panel p-16 text-center text-white/50">
              No products found. Try a different search or category.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={buildLink({ page: p })}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-colors ${
                    p === page ? "bg-cyan-glow text-charcoal-950 font-bold" : "glass-card text-white/60"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
