/**
 * HeroSection.jsx
 *
 * Hero banner with search bar and autocomplete suggestions.
 * On submit navigates to /products?search=query.
 *
 * Props: none (self-contained, uses navigate internally)
 */
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/ui/SearchBar";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-indigo-600 px-4 py-16 sm:py-24 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white opacity-5" />
      <div className="absolute bottom-[-40px] left-10 w-52 h-52 rounded-full bg-white opacity-5" />
      <div className="absolute top-10 right-1/3 w-24 h-24 rounded-full bg-white opacity-5" />

      <div className="max-w-2xl mx-auto text-center relative">
        <span className="inline-block text-xs font-bold tracking-widest text-indigo-200 uppercase mb-4 bg-white/10 px-4 py-1.5 rounded-full">
          Smart Product Discovery
        </span>
        <h1 className="text-white text-3xl sm:text-5xl font-bold mb-4 tracking-tight leading-tight">
          Find exactly what
          <br />
          you're looking for
        </h1>
        <p className="text-indigo-200 text-base sm:text-lg mb-8">
          Thousands of products from verified sellers — personalised for you
        </p>

        <SearchBar variant="hero" />
      </div>
    </section>
  );
}
