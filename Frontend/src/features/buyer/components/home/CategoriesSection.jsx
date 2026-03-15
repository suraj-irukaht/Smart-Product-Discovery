/**
 * CategoriesSection.jsx
 * Horizontally scrollable category row using shadcn Carousel.
 */
import { Link } from "react-router-dom";
import useCategories from "@/features/categories/hooks/useCategory";
import SectionHeader from "./SectionHeader";
import { Tag } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const CAT_COLORS = [
  { bg: "bg-violet-50  dark:bg-violet-950", text: "text-violet-500" },
  { bg: "bg-rose-50    dark:bg-rose-950", text: "text-rose-500" },
  { bg: "bg-amber-50   dark:bg-amber-950", text: "text-amber-500" },
  { bg: "bg-emerald-50 dark:bg-emerald-950", text: "text-emerald-500" },
  { bg: "bg-sky-50     dark:bg-sky-950", text: "text-sky-500" },
  { bg: "bg-pink-50    dark:bg-pink-950", text: "text-pink-500" },
  { bg: "bg-orange-50  dark:bg-orange-950", text: "text-orange-500" },
  { bg: "bg-teal-50    dark:bg-teal-950", text: "text-teal-500" },
  { bg: "bg-indigo-50  dark:bg-indigo-950", text: "text-indigo-500" },
  { bg: "bg-lime-50    dark:bg-lime-950", text: "text-lime-500" },
];

export default function CategoriesSection() {
  const { data } = useCategories();
  const categories = data?.categories ?? [];

  if (!categories.length) return null;

  return (
    <section>
      <SectionHeader
        title="Browse Categories"
        subtitle="Shop by what you love"
        link="/products"
        linkLabel="All Products"
      />

      {/* px-10 reserves space for Prev/Next buttons on the sides */}
      <div className="relative">
        <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
          <CarouselContent className="-ml-3">
            {categories.map((c, i) => {
              const { bg, text } = CAT_COLORS[i % CAT_COLORS.length];
              return (
                <CarouselItem key={c._id} className="pl-3 basis-auto">
                  <Link
                    to={`/products?category=${c._id}`}
                    className="flex flex-col justify-center items-center gap-2.5 px-5 py-4
                      bg-card rounded-2xl border border-border w-[104px]
                      hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg}`}
                    >
                      <Tag className={`w-5 h-5 ${text}`} />
                    </div>
                    <span className="text-xs font-semibold text-foreground text-center leading-tight capitalize line-clamp-2">
                      {c.name}
                    </span>
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
