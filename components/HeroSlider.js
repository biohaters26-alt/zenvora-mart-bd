"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const SLIDES = [
  {
    title: "Premium Audio, Reimagined",
    subtitle: "ANC Earbuds with Touch Control — engineered for pure sound clarity.",
    cta: "Shop Earbuds",
    href: "/products?category=earbuds-audio",
    gradient: "from-cyan-glow/25 via-transparent to-emerald-glow/10"
  },
  {
    title: "Smart Wearables. Elevated Living.",
    subtitle: "Track your health, stay connected, look sharp — all on your wrist.",
    cta: "Shop Smart Watches",
    href: "/products?category=smart-watches",
    gradient: "from-emerald-glow/25 via-transparent to-cyan-glow/10"
  },
  {
    title: "Power That Keeps Up With You",
    subtitle: "Fast chargers & power banks built for the always-on lifestyle.",
    cta: "Shop Power & Charging",
    href: "/products?category=power-charging",
    gradient: "from-gold/15 via-transparent to-cyan-glow/10"
  }
];

export default function HeroSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive((a) => (a + 1) % SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 glass-panel">
      <div className="relative h-[420px] sm:h-[480px]">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.title}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === active ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} bg-hero-gradient`} />
            <div className="relative h-full flex flex-col items-center justify-center text-center px-6 sm:px-16">
              <span className="badge-cyan mb-4">New Arrivals Weekly</span>
              <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white max-w-2xl leading-tight">
                {slide.title}
              </h1>
              <p className="mt-4 text-white/60 max-w-xl text-sm sm:text-base">{slide.subtitle}</p>
              <Link href={slide.href} className="btn-primary mt-8">
                {slide.cta}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-8 bg-cyan-glow" : "w-1.5 bg-white/25"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
