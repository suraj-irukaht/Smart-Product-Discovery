export default function AdminUsersTable({ users, onToggleLock, isPending }) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "var(--color-card)",
      }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr
            style={{
              borderBottom: "1px solid var(--color-border)",
              backgroundColor: "var(--color-muted)",
            }}
          >
            {["Name", "Email", "Joined", "Status", "Action"].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left font-medium"
                style={{ color: "var(--color-muted-foreground)" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr
              key={user._id}
              style={{
                borderBottom:
                  i < users.length - 1
                    ? "1px solid var(--color-border)"
                    : "none",
              }}
            >
              {/* Name */}
              <td className="px-4 py-3">
                <p
                  className="font-medium"
                  style={{ color: "var(--color-foreground)" }}
                >
                  {user.name}
                </p>
                {user.shopName && (
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--color-muted-foreground)" }}
                  >
                    🏪 {user.shopName}
                  </p>
                )}
              </td>

              {/* Email */}
              <td
                className="px-4 py-3 text-xs"
                style={{ color: "var(--color-muted-foreground)" }}
              >
                {user.email}
              </td>

              {/* Joined */}
              <td
                className="px-4 py-3 text-xs"
                style={{ color: "var(--color-muted-foreground)" }}
              >
                {new Date(user.createdAt).toLocaleDateString()}
              </td>

              {/* Status */}
              <td className="px-4 py-3">
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: user.is_locked ? "#fee2e2" : "#dcfce7",
                    color: user.is_locked ? "#991b1b" : "#15803d",
                  }}
                >
                  {user.is_locked ? "Locked" : "Active"}
                </span>
              </td>

              {/* Action */}
              <td className="px-4 py-3">
                <button
                  onClick={() => onToggleLock(user._id)}
                  disabled={isPending}
                  className="rounded-md px-3 py-1 text-xs font-medium hover:opacity-80 disabled:opacity-40 transition-all border"
                  style={{
                    borderColor: user.is_locked
                      ? "var(--color-success)"
                      : "var(--color-destructive)",
                    color: user.is_locked
                      ? "var(--color-success)"
                      : "var(--color-destructive)",
                  }}
                >
                  {user.is_locked ? "Unlock" : "Lock"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
