// // // src/components/ui/Pagination.jsx
// // import { useEffect } from "react";
// // import { useSearchParams } from "react-router-dom";
// // import { PAGINATION } from "@/config/config.pagination";

// // export default function Pagination({ totalPages, total }) {
// //   const [searchParams, setSearchParams] = useSearchParams();

// //   const page = Number(searchParams.get("page")) || PAGINATION.DEFAULT_PAGE;
// //   const limit = Number(searchParams.get("limit")) || PAGINATION.DEFAULT_LIMIT;

// //   // ← Auto-redirect if current page is empty but products exist
// //   useEffect(() => {
// //     if (page > totalPages && totalPages > 0) {
// //       setSearchParams({ page: 1, limit });
// //     }
// //   }, [page, totalPages]);

// //   if (totalPages <= 1) return null;

// //   const goTo = (newPage) => {
// //     setSearchParams({ page: newPage, limit });
// //   };

// //   const getPageNumbers = (current, total) => {
// //     if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
// //     if (current <= 3) return [1, 2, 3, 4, "...", total];
// //     if (current >= total - 2)
// //       return [1, "...", total - 3, total - 2, total - 1, total];
// //     return [1, "...", current - 1, current, current + 1, "...", total];
// //   };

// //   return (
// //     <div className="flex items-center justify-center gap-3 mt-6">
// //       <button
// //         onClick={() => goTo(page - 1)}
// //         disabled={page === 1}
// //         className="rounded-lg px-4 py-2 text-sm font-medium border disabled:opacity-40 transition-all hover:opacity-80"
// //         style={{
// //           borderColor: "var(--color-border)",
// //           color: "var(--color-foreground)",
// //         }}
// //       >
// //         ← Prev
// //       </button>

// //       <div className="flex items-center gap-1">
// //         {getPageNumbers(page, totalPages).map((p, i) =>
// //           p === "..." ? (
// //             <span
// //               key={`dots-${i}`}
// //               className="w-8 text-center text-sm"
// //               style={{ color: "var(--color-muted-foreground)" }}
// //             >
// //               ...
// //             </span>
// //           ) : (
// //             <button
// //               key={p}
// //               onClick={() => goTo(p)}
// //               className="w-8 h-8 rounded-lg text-sm font-medium transition-all hover:opacity-80"
// //               style={{
// //                 backgroundColor:
// //                   p === page ? "var(--color-primary)" : "transparent",
// //                 color:
// //                   p === page
// //                     ? "var(--color-primary-foreground)"
// //                     : "var(--color-foreground)",
// //                 border: p === page ? "none" : "1px solid var(--color-border)",
// //               }}
// //             >
// //               {p}
// //             </button>
// //           ),
// //         )}
// //       </div>

// //       <button
// //         onClick={() => goTo(page + 1)}
// //         disabled={page === totalPages}
// //         className="rounded-lg px-4 py-2 text-sm font-medium border disabled:opacity-40 transition-all hover:opacity-80"
// //         style={{
// //           borderColor: "var(--color-border)",
// //           color: "var(--color-foreground)",
// //         }}
// //       >
// //         Next →
// //       </button>
// //     </div>
// //   );
// // }

// // src/components/ui/Pagination.jsx

// import { useSearchParams } from "react-router-dom";

// export default function Pagination({ totalPages }) {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const currentPage = Number(searchParams.get("page")) || 1;

//   if (totalPages <= 1) return null;

//   const goTo = (page) => {
//     // ✅ merge — preserve all existing params, only update page
//     const next = new URLSearchParams(searchParams);
//     next.set("page", page);
//     setSearchParams(next);
//   };

//   const pages = () => {
//     const range = [];
//     for (let i = 1; i <= totalPages; i++) range.push(i);
//     return range;
//   };

//   return (
//     <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
//       <button
//         onClick={() => goTo(currentPage - 1)}
//         disabled={currentPage === 1}
//         className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
//       >
//         ← Prev
//       </button>

//       {pages().map((p) => (
//         <button
//           key={p}
//           onClick={() => goTo(p)}
//           className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
//             p === currentPage
//               ? "bg-indigo-600 text-white"
//               : "border border-slate-200 text-slate-600 hover:bg-slate-100"
//           }`}
//         >
//           {p}
//         </button>
//       ))}

//       <button
//         onClick={() => goTo(currentPage + 1)}
//         disabled={currentPage === totalPages}
//         className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
//       >
//         Next →
//       </button>
//     </div>
//   );
// }

// src/components/ui/Pagination.jsx
import { useSearchParams } from "react-router-dom";

export default function Pagination({
  totalPages,
  currentPage: controlledPage,
  onPageChange,
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Controlled mode (useState) vs URL mode (useSearchParams)
  const isControlled = onPageChange !== undefined;
  const currentPage = isControlled
    ? controlledPage
    : Number(searchParams.get("page")) || 1;

  if (totalPages <= 1) return null;

  const goTo = (page) => {
    if (page < 1 || page > totalPages) return;
    if (isControlled) {
      onPageChange(page);
    } else {
      const next = new URLSearchParams(searchParams);
      next.set("page", page);
      setSearchParams(next);
    }
  };

  const getPages = () => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, "...", totalPages];
    if (currentPage >= totalPages - 2)
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        ← Prev
      </button>

      {getPages().map((p, i) =>
        p === "..." ? (
          <span
            key={`dots-${i}`}
            className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm"
          >
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p)}
            className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              p === currentPage
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                : "border border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        Next →
      </button>
    </div>
  );
}
