
import { supabase } from "@/lib/supabase";
import { Notification, NotificationsAPI } from "./types";

const fetchNotifications = async (userId: string): Promise<Notification[]> => {
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
};

const markAsRead = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);

    if (error) {
      console.error("Error marking notification as read:", error);
    }
  } catch (error) {
    console.error("Error in markAsRead:", error);
  }
};

const markAllAsRead = async (userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId);

    if (error) {
      console.error("Error marking all notifications as read:", error);
    }
  } catch (error) {
    console.error("Error in markAllAsRead:", error);
  }
};

const deleteNotification = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting notification:", error);
    }
  } catch (error) {
    console.error("Error in deleteNotification:", error);
  }
};

const deleteAllNotifications = async (userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("user_id", userId);

    if (error) {
      console.error("Error deleting all notifications:", error);
    }
  } catch (error) {
    console.error("Error in deleteAllNotifications:", error);
  }
};

export const notificationsAPI: NotificationsAPI = {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications
};
