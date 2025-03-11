
import { toast } from "sonner";
import { Notification } from "./types";
import { supabase } from "@/lib/supabase";

export const setupRealtimeSubscription = (
  userId: string,
  updateNotifications: (updater: (prev: Notification[]) => Notification[]) => void,
  handleNotificationClick: (notification: Notification) => void
) => {
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
          // إضافة إشعار جديد
          updateNotifications(prev => [payload.new as Notification, ...prev]);
          toast(payload.new.title, {
            description: payload.new.message,
            duration: 500,
            action: {
              label: "عرض",
              onClick: () => handleNotificationClick(payload.new as Notification),
            },
          });
        } else if (payload.eventType === "UPDATE") {
          // تحديث إشعار
          updateNotifications(prev => 
            prev.map(n => n.id === payload.new.id ? payload.new as Notification : n)
          );
        } else if (payload.eventType === "DELETE") {
          // حذف إشعار
          updateNotifications(prev => 
            prev.filter(n => n.id !== payload.old.id)
          );
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
