"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/lib/useAuth";
import { STORE_NAME } from "@/lib/constants";

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) router.push(`/products?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-charcoal-950/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-glow to-emerald-glow flex items-center justify-center font-display font-bold text-charcoal-950">
              Z
            </span>
            <span className="font-display text-lg font-bold text-white hidden sm:block">
              {STORE_NAME}
            </span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for earbuds, watches, gadgets..."
                className="input-field !py-2 !pr-10"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-glow"
                aria-label="Search"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>
            </div>
          </form>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-white/80">
            <Link href="/products" className="hover:text-cyan-glow transition-colors">
              Shop
            </Link>
            <Link href="/orders/track" className="hover:text-cyan-glow transition-colors">
              Track Order
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
              <svg className="w-6 h-6 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-glow text-charcoal-950 text-[10px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {!loading && user ? (
              <div className="hidden sm:flex items-center gap-2">
                {user.role === "admin" && (
                  <Link href="/admin" className="btn-outline !py-1.5 !px-3 text-xs">
                    Admin
                  </Link>
                )}
                <button onClick={logout} className="btn-outline !py-1.5 !px-3 text-xs">
                  Logout
                </button>
              </div>
            ) : (
              !loading && (
                <Link href="/login" className="hidden sm:inline-flex btn-primary !py-1.5 !px-4 text-xs">
                  Login
                </Link>
              )
            )}

            <button
              className="lg:hidden p-2 text-white/80"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden pb-4 flex flex-col gap-3 border-t border-white/10 pt-4">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="input-field"
              />
            </form>
            <Link href="/products" className="text-white/80 hover:text-cyan-glow">
              Shop
            </Link>
            <Link href="/orders/track" className="text-white/80 hover:text-cyan-glow">
              Track Order
            </Link>
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link href="/admin" className="text-cyan-glow">
                    Admin Dashboard
                  </Link>
                )}
                <button onClick={logout} className="text-left text-white/80">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="text-cyan-glow">
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
