
import { User } from "@supabase/supabase-js";

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: Date;
  type: "success" | "error" | "info" | "warning";
  link?: string;
}

export interface NotificationsAPI {
  fetchNotifications: (userId: string) => Promise<Notification[]>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  deleteAllNotifications: (userId: string) => Promise<void>;
}

export interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
  handleNotificationClick: (notification: Notification) => void;
}
