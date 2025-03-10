
import { supabase } from "@/lib/supabase";
import { Notification } from "./types";
import { toast } from "sonner";

export async function fetchUserNotifications(userId: string | undefined) {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }

    return data as Notification[];
  } catch (error) {
    console.error("Error in fetchNotifications:", error);
    return [];
  }
}

export async function markNotificationAsRead(id: string) {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);

    if (error) {
      console.error("Error marking notification as read:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error in markAsRead:", error);
    return false;
  }
}

export async function markAllNotificationsAsRead(userId: string | undefined) {
  if (!userId) return false;
  
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId);

    if (error) {
      console.error("Error marking all notifications as read:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error in markAllAsRead:", error);
    return false;
  }
}

export async function deleteUserNotification(id: string) {
  try {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting notification:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error in deleteNotification:", error);
    return false;
  }
}

export async function deleteAllUserNotifications(userId: string | undefined) {
  if (!userId) return false;
  
  try {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("user_id", userId);

    if (error) {
      console.error("Error deleting all notifications:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error in deleteAllNotifications:", error);
    return false;
  }
}

export function setupNotificationToast(notification: Notification, handleClick: (notification: Notification) => void) {
  toast(notification.title, {
    description: notification.message,
    duration: 1000, // 1 second
    action: {
      label: "عرض",
      onClick: () => handleClick(notification),
    },
  });
}
