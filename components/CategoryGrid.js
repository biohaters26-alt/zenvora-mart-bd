import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

const ICONS = {
  headphones: (
    <path d="M3 18v-6a9 9 0 0118 0v6M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
  ),
  watch: (
    <>
      <circle cx="12" cy="12" r="7" />
      <path d="M12 9v3l2 2M9 3h6M9 21h6" />
    </>
  ),
  smartphone: (
    <>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M11 18h2" />
    </>
  ),
  home: <path d="M3 9.5 12 3l9 6.5V21a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z" />,
  gamepad: (
    <>
      <path d="M6 12h4M8 10v4" />
      <circle cx="16.5" cy="10.5" r="1" />
      <circle cx="18.5" cy="12.5" r="1" />
      <rect x="2" y="8" width="20" height="8" rx="4" />
    </>
  ),
  "battery-charging": (
    <>
      <path d="M5 8H2v8h3M10 8h9a2 2 0 012 2v4a2 2 0 01-2 2h-9z" />
      <path d="M11 11l-2 3h3l-2 3" />
    </>
  )
};

export default function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title">Shop by Category</h2>
        <Link href="/products" className="text-sm text-cyan-soft hover:text-cyan-glow">
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products?category=${cat.slug}`}
            className="glass-card flex flex-col items-center justify-center gap-3 p-6 text-center group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-glow/20 to-emerald-glow/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg
                className="w-6 h-6 text-cyan-glow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {ICONS[cat.icon]}
              </svg>
            </div>
            <span className="text-sm font-medium text-white/85 group-hover:text-cyan-glow transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
