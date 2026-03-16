import { useSearchParams } from "react-router-dom";

import {
  Pagination as ShadPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

export default function PaginationUi({
  totalPages,
  currentPage: controlledPage,
  onPageChange,
}) {
  const [searchParams, setSearchParams] = useSearchParams();

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
    <ShadPagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => goTo(currentPage - 1)}
            className={
              currentPage === 1
                ? "pointer-events-none opacity-40"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {getPages().map((p, i) =>
          p === "..." ? (
            <PaginationItem key={`dots-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                isActive={p === currentPage}
                onClick={() => goTo(p)}
                className={
                  p === currentPage ? "bg-black text-white" : "cursor-pointer"
                }
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => goTo(currentPage + 1)}
            className={
              currentPage === totalPages
                ? "pointer-events-none opacity-40"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </ShadPagination>
  );
}
