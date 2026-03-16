/**
 * SectionHeader Component
 *
 * A reusable header used for homepage sections such as:
 *  - "For You"
 *  - "Trending Now"
 *  - "Still Interested"
 *
 * Features
 * --------
 * • Displays a section title and optional subtitle
 * • Optional "View all" link for navigating to a full listing page
 * • Responsive typography for mobile and desktop
 * • Clean alignment between title block and action link
 *
 * Props
 * -----
 * @param {string} title       - Main section title
 * @param {string} subtitle    - Optional subtitle or description
 * @param {string} link        - Optional route for the "View all" link
 * @param {string} linkLabel   - Text for the action link (default: "View all")
 */

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function SectionHeader({
  title,
  subtitle,
  link,
  linkLabel = "View all",
}) {
  return (
    <div className="flex items-end justify-between mb-6 lg:mb-10">
      {/* Left Side: Title + Subtitle */}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
          {title}
        </h2>

        {subtitle && (
          <p className="text-sm text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Side: Optional Action Link */}
      {link && (
        <Link
          to={link}
          className="group flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground shrink-0"
        >
          {linkLabel}

          {/* Arrow icon with subtle hover animation */}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
