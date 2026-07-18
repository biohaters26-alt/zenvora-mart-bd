"use client";

import { useState } from "react";
import Image from "next/image";
import { CATEGORIES } from "@/lib/constants";

const EMPTY_FORM = {
  name: "",
  category: CATEGORIES[0].slug,
  brand: "Zenvora",
  price: "",
  compareAtPrice: "",
  stock: "",
  sku: "",
  shortDescription: "",
  description: "",
  images: "",
  isFeatured: false,
  isActive: true
};

export default function AdminProductsClient({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError("");
    setShowForm(true);
  };

  const openEdit = (product) => {
    setForm({
      name: product.name,
      category: product.category,
      brand: product.brand,
      price: product.price,
      compareAtPrice: product.compareAtPrice || "",
      stock: product.stock,
      sku: product.sku || "",
      shortDescription: product.shortDescription || "",
      description: product.description || "",
      images: (product.images || []).join(", "),
      isFeatured: product.isFeatured,
      isActive: product.isActive
    });
    setEditingId(product._id);
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      price: Number(form.price),
      compareAtPrice: Number(form.compareAtPrice) || 0,
      stock: Number(form.stock),
      images: form.images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    };

    try {
      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to save product.");
        return;
      }

      if (editingId) {
        setProducts((prev) => prev.map((p) => (p._id === editingId ? data.product : p)));
      } else {
        setProducts((prev) => [data.product, ...prev]);
      }

      setShowForm(false);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product permanently?")) return;

    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } else {
      alert(data.message || "Failed to delete product.");
    }
  };

  const toggleActive = async (product) => {
    const res = await fetch(`/api/products/${product._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !product.isActive })
    });
    const data = await res.json();
    if (data.success) {
      setProducts((prev) => prev.map((p) => (p._id === product._id ? data.product : p)));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title">Manage Products</h1>
        <button onClick={openCreate} className="btn-primary !py-2.5 !px-4 text-sm">
          + Add Product
        </button>
      </div>

      <div className="glass-panel overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-white/40 border-b border-white/[0.06]">
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td className="p-4 flex items-center gap-3 min-w-[220px]">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                    <Image src={product.images?.[0]} alt={product.name} fill sizes="40px" className="object-cover" />
                  </div>
                  <span className="text-white line-clamp-1">{product.name}</span>
                </td>
                <td className="p-4 text-white/60">{product.category}</td>
                <td className="p-4 text-emerald-soft font-semibold">৳{product.price}</td>
                <td className="p-4 text-white/60">{product.stock}</td>
                <td className="p-4">
                  <button
                    onClick={() => toggleActive(product)}
                    className={`badge ${
                      product.isActive
                        ? "bg-emerald-glow/10 text-emerald-soft border border-emerald-glow/30"
                        : "bg-white/5 text-white/40 border border-white/10"
                    }`}
                  >
                    {product.isActive ? "Active" : "Hidden"}
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(product)} className="text-cyan-soft hover:text-cyan-glow text-xs">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="text-red-300 hover:text-red-200 text-xs">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-white/40">
                  No products yet. Click "Add Product" to create your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-charcoal-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-white text-lg">
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-white/50 hover:text-white text-2xl leading-none">
                ×
              </button>
            </div>

            {error && (
              <div className="mb-4 text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                required
                placeholder="Product Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field sm:col-span-2"
              />

              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input-field"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                placeholder="Brand"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="input-field"
              />

              <input
                required
                type="number"
                placeholder="Price (৳)"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="input-field"
              />

              <input
                type="number"
                placeholder="Compare-at Price (optional)"
                value={form.compareAtPrice}
                onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
                className="input-field"
              />

              <input
                required
                type="number"
                placeholder="Stock Quantity"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="input-field"
              />

              <input
                placeholder="SKU"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className="input-field"
              />

              <input
                required
                placeholder="Image URLs, comma separated"
                value={form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })}
                className="input-field sm:col-span-2"
              />

              <textarea
                placeholder="Short description"
                value={form.shortDescription}
                onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                rows={2}
                className="input-field sm:col-span-2 resize-none"
              />

              <textarea
                placeholder="Full description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="input-field sm:col-span-2 resize-none"
              />

              <label className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="accent-cyan-glow"
                />
                Featured Product
              </label>

              <label className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="accent-cyan-glow"
                />
                Active (visible on site)
              </label>

              <div className="sm:col-span-2 flex gap-3 mt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
                  {saving ? "Saving..." : editingId ? "Update Product" : "Create Product"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
