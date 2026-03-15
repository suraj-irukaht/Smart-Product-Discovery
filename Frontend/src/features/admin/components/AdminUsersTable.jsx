import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Calendar, Store, Lock, Unlock } from "lucide-react";

export default function AdminUsersTable({ users, onToggleLock, isPending }) {
  if (users.length === 0) return null;

  return (
    <div className="md:grid md:grid-cols-2 gap-5">
      {users.map((user) => (
        <Card
          key={user._id}
          className="border hover:shadow-md transition-shadow duration-200"
        >
          <CardContent className="p-4">
            {/* Row 1: Name + status badge */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 min-w-0">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {user.name}
                  </p>
                  {user.shopName && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Store className="w-3 h-3 text-muted-foreground shrink-0" />
                      <p className="text-xs text-muted-foreground truncate">
                        {user.shopName}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status badge */}
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                  user.is_locked
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                }`}
              >
                {user.is_locked ? "Locked" : "Active"}
              </span>
            </div>

            {/* Row 2: Email + Joined */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Joined{" "}
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <Separator className="mb-3" />

            {/* Row 3: Action */}
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">Account access</p>
              <Button
                variant="outline"
                size="sm"
                disabled={isPending}
                onClick={() => onToggleLock(user._id)}
                className={`h-7 text-xs gap-1.5 font-medium ${
                  user.is_locked
                    ? "text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                    : "text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                }`}
              >
                {user.is_locked ? (
                  <>
                    <Unlock className="w-3 h-3" /> Unlock
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3" /> Lock
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
