import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotifications,
  markAllRead,
  markOneRead,
} from "../api/notificationApi";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

/**
 * useNotifications
 *
 * - Fetches notifications list + unread count via React Query
 * - Opens an SSE connection to /admin/notifications/stream
 * - Invalidates the query on every push → bell count updates in real-time
 */
export function useNotifications() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: fetchNotifications,
    staleTime: 0,
  });

  // SSE — connect once, invalidate on every push
  useEffect(() => {
    const es = new EventSource(`${BASE_URL}/admin/notifications/stream`, {
      withCredentials: true,
    });

    es.onmessage = () => {
      // A new notification was pushed — refetch the list
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
    };

    es.onerror = () => {
      // Browser will auto-reconnect on error — no action needed
    };

    return () => es.close();
  }, [queryClient]);

  return {
    notifications: data?.notifications ?? [],
    unreadCount: data?.unreadCount ?? 0,
    isLoading,
  };
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] }),
  });
}

export function useMarkOneRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markOneRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] }),
  });
}
