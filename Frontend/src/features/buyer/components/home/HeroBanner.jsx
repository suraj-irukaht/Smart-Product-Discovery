/**
 * HeroSection.jsx
 * Full-width hero — no search bar, editorial feel.
 */
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-foreground min-h-[480px] flex items-center">
      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
      <div className="absolute bottom-[-50px] left-8 w-64 h-64 rounded-full bg-white/5" />
      <div className="absolute top-12 right-1/3 w-28 h-28 rounded-full bg-white/5" />

      <div className="relative max-w-4xl mx-auto px-6 py-20 sm:py-28 text-center w-full">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          Smart Product Discovery
        </div>

        {/* Headline */}
        <h1 className="text-white text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6">
          Find exactly what
          <br />
          <span className="text-white/60">you're looking for</span>
        </h1>

        {/* Sub */}
        <p className="text-white/50 text-base sm:text-lg max-w-xl mx-auto mb-10">
          Thousands of products from verified sellers — personalised for you
        </p>

        {/* CTA */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-white text-foreground text-sm font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors"
          >
            Browse Products
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-white/20 transition-colors"
          >
            View Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
