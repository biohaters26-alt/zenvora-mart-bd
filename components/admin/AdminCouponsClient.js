"use client";

import { useState } from "react";

const EMPTY_FORM = {
  code: "",
  type: "percentage",
  value: "",
  minOrderAmount: "",
  maxDiscountAmount: "",
  usageLimit: "",
  expiresAt: ""
};

function generateRandomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "ZVM-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export default function AdminCouponsClient({ initialCoupons }) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      code: form.code || generateRandomCode(),
      type: form.type,
      value: Number(form.value),
      minOrderAmount: Number(form.minOrderAmount) || 0,
      maxDiscountAmount: Number(form.maxDiscountAmount) || 0,
      usageLimit: Number(form.usageLimit) || 0,
      expiresAt: form.expiresAt || undefined
    };

    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to create coupon.");
        return;
      }

      setCoupons((prev) => [data.coupon, ...prev]);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (coupon) => {
    const res = await fetch(`/api/coupons/${coupon._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !coupon.isActive })
    });
    const data = await res.json();
    if (data.success) {
      setCoupons((prev) => prev.map((c) => (c._id === coupon._id ? data.coupon : c)));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this coupon?")) return;
    const res = await fetch(`/api/coupons/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      setCoupons((prev) => prev.filter((c) => c._id !== id));
    }
  };

  return (
    <div>
      <h1 className="section-title mb-6">Manage Coupons</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="glass-panel overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/40 border-b border-white/[0.06]">
                <th className="p-4">Code</th>
                <th className="p-4">Type</th>
                <th className="p-4">Value</th>
                <th className="p-4">Usage</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="border-b border-white/[0.04]">
                  <td className="p-4 font-mono text-cyan-soft">{coupon.code}</td>
                  <td className="p-4 text-white/60 capitalize">{coupon.type}</td>
                  <td className="p-4 text-white/60">
                    {coupon.type === "percentage" ? `${coupon.value}%` : `৳${coupon.value}`}
                  </td>
                  <td className="p-4 text-white/60">
                    {coupon.usedCount} / {coupon.usageLimit || "∞"}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleActive(coupon)}
                      className={`badge ${
                        coupon.isActive
                          ? "bg-emerald-glow/10 text-emerald-soft border border-emerald-glow/30"
                          : "bg-white/5 text-white/40 border border-white/10"
                      }`}
                    >
                      {coupon.isActive ? "Active" : "Disabled"}
                    </button>
                  </td>
                  <td className="p-4">
                    <button onClick={() => handleDelete(coupon._id)} className="text-red-300 hover:text-red-200 text-xs">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white/40">
                    No coupons yet. Create one on the right.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="glass-panel p-6 h-fit">
          <h2 className="font-semibold text-white mb-4">Generate New Coupon</h2>

          {error && (
            <div className="mb-4 text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex gap-2">
              <input
                placeholder="Code (blank = auto)"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className="input-field flex-1"
              />
              <button
                type="button"
                onClick={() => setForm({ ...form, code: generateRandomCode() })}
                className="btn-outline !px-3 text-xs shrink-0"
              >
                Random
              </button>
            </div>

            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="input-field"
            >
              <option value="percentage">Percentage Discount</option>
              <option value="flat">Flat Amount Discount</option>
            </select>

            <input
              required
              type="number"
              placeholder={form.type === "percentage" ? "Discount %" : "Discount Amount (৳)"}
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              className="input-field"
            />

            <input
              type="number"
              placeholder="Minimum Order Amount (optional)"
              value={form.minOrderAmount}
              onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
              className="input-field"
            />

            {form.type === "percentage" && (
              <input
                type="number"
                placeholder="Max Discount Cap (optional)"
                value={form.maxDiscountAmount}
                onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })}
                className="input-field"
              />
            )}

            <input
              type="number"
              placeholder="Usage Limit (0 = unlimited)"
              value={form.usageLimit}
              onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
              className="input-field"
            />

            <label className="text-xs text-white/50">Expiry Date (optional)</label>
            <input
              type="date"
              value={form.expiresAt}
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              className="input-field"
            />

            <button type="submit" disabled={saving} className="btn-primary mt-2 disabled:opacity-50">
              {saving ? "Creating..." : "Create Coupon"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
