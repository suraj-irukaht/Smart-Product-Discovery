/**
 * CategoriesSection Component
 *
 * Displays a horizontally scrollable list of product categories.
 * Uses the shadcn/ui Carousel component to create a smooth
 * drag-enabled category slider similar to modern marketplaces.
 *
 * Features
 * --------
 * • Horizontal drag scroll (touch + mouse)
 * • Carousel navigation buttons
 * • Dynamic category colors
 * • Responsive category cards
 * • Clean integration with product filtering
 *
 * Data Source
 * -----------
 * Categories are fetched using the `useCategories` hook.
 *
 * Navigation
 * ----------
 * Clicking a category navigates to:
 * /products?category=<category_id>
 *
 * UI Notes
 * --------
 * • Each category card includes an icon and name
 * • Colors rotate through a predefined palette
 * • Cards include hover animation and elevation
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

/**
 * Color palette used for category icon backgrounds.
 * Rotates automatically so categories appear visually diverse.
 */
const CAT_COLORS = [
  { bg: "bg-violet-50 dark:bg-violet-950", text: "text-violet-500" },
  { bg: "bg-rose-50 dark:bg-rose-950", text: "text-rose-500" },
  { bg: "bg-amber-50 dark:bg-amber-950", text: "text-amber-500" },
  { bg: "bg-emerald-50 dark:bg-emerald-950", text: "text-emerald-500" },
  { bg: "bg-sky-50 dark:bg-sky-950", text: "text-sky-500" },
  { bg: "bg-pink-50 dark:bg-pink-950", text: "text-pink-500" },
  { bg: "bg-orange-50 dark:bg-orange-950", text: "text-orange-500" },
  { bg: "bg-teal-50 dark:bg-teal-950", text: "text-teal-500" },
  { bg: "bg-indigo-50 dark:bg-indigo-950", text: "text-indigo-500" },
  { bg: "bg-lime-50 dark:bg-lime-950", text: "text-lime-500" },
];

export default function CategoriesSection() {
  /**
   * Fetch category data from API
   */
  const { data } = useCategories();

  /**
   * Safely extract categories array
   */
  const categories = data?.categories ?? [];

  /**
   * If there are no categories available,
   * do not render the section.
   */
  if (!categories.length) return null;

  return (
    <section className="space-y-4">
      {/* Section title */}
      <SectionHeader
        title="Browse Categories"
        subtitle="Shop by what you love"
        link="/products"
        linkLabel="All Products"
      />

      {/* Carousel container */}
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-3">
            {categories.map((category, index) => {
              /**
               * Rotate color palette so categories
               * get different icon colors.
               */
              const { bg, text } = CAT_COLORS[index % CAT_COLORS.length];

              return (
                <CarouselItem key={category._id} className="pl-3 basis-auto">
                  <Link
                    to={`/products?category=${category._id}`}
                    className="
                      group flex flex-col items-center justify-center
                      gap-3 px-5 py-4 w-[110px]
                      bg-card border border-border rounded-2xl
                      transition-all duration-200
                      hover:shadow-md hover:-translate-y-0.5
                    "
                  >
                    {/* Category icon */}
                    <div
                      className={`
                        w-11 h-11 rounded-xl flex items-center justify-center
                        ${bg}
                      `}
                    >
                      <Tag
                        className={`w-5 h-5 ${text} group-hover:scale-105 transition-transform`}
                      />
                    </div>

                    {/* Category name */}
                    <span
                      className="
                        text-xs font-semibold text-center capitalize
                        text-foreground leading-tight
                        line-clamp-2
                      "
                    >
                      {category.name}
                    </span>
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {/* Navigation buttons */}
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
