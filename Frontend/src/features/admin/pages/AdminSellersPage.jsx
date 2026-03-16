// src/features/admin/pages/AdminSellersPage.jsx
import { useSearchParams } from "react-router-dom";
import { useUsersByRole, useToggleLockUser } from "@features/admin";
import AdminUsersTable from "../components/AdminUsersTable";
import Pagination from "@/components/ui/PaginationUi";
import { PAGINATION } from "@/config/config.pagination";
import Breadcrumbs from "@components/ui/Breadcrumbs";
import LoadingSpinner from "@components/ui/LoadingSpinner";

export default function AdminSellersPage() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || PAGINATION.DEFAULT_PAGE;

  const { data, isLoading } = useUsersByRole("seller", page);
  const { mutate: toggleLock, isPending } = useToggleLockUser();

  const users = data?.users ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div className="mb-6">
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--color-foreground)" }}
          >
            Manage Sellers
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--color-muted-foreground)" }}
          >
            {data?.total ?? 0} total sellers
          </p>
        </div>

        {/* Breadcrumb */}
        <Breadcrumbs
          items={[
            { label: "Dashboard", to: "/admin" },
            { label: "Manage sellers" },
          ]}
        />

        {isLoading && <LoadingSpinner />}

        {!isLoading && users.length === 0 && (
          <div
            className="text-center py-20 rounded-xl border-2 border-dashed"
            style={{ borderColor: "var(--color-border)" }}
          >
            <p className="text-4xl mb-3">🏪</p>
            <p
              className="font-medium"
              style={{ color: "var(--color-foreground)" }}
            >
              No sellers yet
            </p>
          </div>
        )}

        {!isLoading && users.length > 0 && (
          <AdminUsersTable
            users={users}
            onToggleLock={toggleLock}
            isPending={isPending}
          />
        )}

        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
