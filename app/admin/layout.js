import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Admin Dashboard" };

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: "📊" },
  { href: "/admin/products", label: "Products", icon: "📦" },
  { href: "/admin/orders", label: "Orders", icon: "🧾" },
  { href: "/admin/coupons", label: "Coupons", icon: "🏷️" }
];

export default async function AdminLayout({ children }) {
  const admin = await requireAdmin();
  if (!admin) redirect("/login?redirect=/admin");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
      <aside className="glass-panel p-4 h-fit lg:sticky lg:top-24">
        <p className="text-xs uppercase tracking-wide text-white/40 px-3 mb-2">Admin Panel</p>
        <nav className="flex lg:flex-col gap-1 overflow-x-auto">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-cyan-glow/10 hover:text-cyan-glow transition-colors whitespace-nowrap"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div>{children}</div>
    </div>
  );
}
