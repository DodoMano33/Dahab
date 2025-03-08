
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Notification } from "./types";
import { setupNotificationToast } from "./notification-utils";

type NotificationsUpdateHandler = (updater: (prev: Notification[]) => Notification[]) => void;

export function useRealTimeNotifications(
  userId: string | undefined,
  onUpdate: NotificationsUpdateHandler,
  handleNotificationClick: (notification: Notification) => void
) {
  useEffect(() => {
    if (!userId) return () => {};

    const channel = supabase
      .channel("notifications_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("Notification change:", payload);
          
          if (payload.eventType === "INSERT") {
            // Add new notification
            onUpdate((prev) => [payload.new as Notification, ...prev]);
            setupNotificationToast(payload.new as Notification, handleNotificationClick);
          } else if (payload.eventType === "UPDATE") {
            // Update notification
            onUpdate((prev) => 
              prev.map(n => n.id === payload.new.id ? payload.new as Notification : n)
            );
          } else if (payload.eventType === "DELETE") {
            // Delete notification
            onUpdate((prev) => 
              prev.filter(n => n.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, onUpdate, handleNotificationClick]);
}
