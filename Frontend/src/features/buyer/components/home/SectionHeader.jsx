/**
 * SectionHeader.jsx
 *
 * Reusable header row for homepage sections.
 * Left: title + subtitle. Right: optional "View all" link.
 *
 * Props:
 * - title      : string
 * - subtitle   : string (optional)
 * - link       : string (optional) — href for view all
 * - linkLabel  : string (optional, default "View all →")
 */
import { Link } from "react-router-dom";

export default function SectionHeader({
  title,
  subtitle,
  link,
  linkLabel = "View all →",
}) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>
        )}
      </div>
      {link && (
        <Link
          to={link}
          className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors flex-shrink-0"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
