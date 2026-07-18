"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images = [], name }) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : ["https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800"];

  return (
    <div>
      <div className="glass-panel relative aspect-square overflow-hidden">
        <Image src={list[active]} alt={name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" priority />
      </div>

      {list.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
          {list.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                i === active ? "border-cyan-glow" : "border-white/10"
              }`}
            >
              <Image src={img} alt={`${name} ${i + 1}`} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
