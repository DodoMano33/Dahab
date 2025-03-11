
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Notification, UseNotificationsReturn } from "./types";
import { notificationsAPI } from "./api";
import { setupRealtimeSubscription } from "./utils";

export { type Notification } from "./types";

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const cleanup = setupRealtimeSubscription(
        user.id, 
        setNotifications, 
        handleNotificationClick
      );
      return cleanup;
    }
  }, [user]);

  useEffect(() => {
    // تحديث عدد الإشعارات غير المقروءة
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const fetchNotifications = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const data = await notificationsAPI.fetchNotifications(user.id);
      setNotifications(data);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    await notificationsAPI.markAsRead(id);
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = async () => {
    if (!user) return;
    await notificationsAPI.markAllAsRead(user.id);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = async (id: string) => {
    await notificationsAPI.deleteNotification(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const deleteAllNotifications = async () => {
    if (!user) return;
    await notificationsAPI.deleteAllNotifications(user.id);
    setNotifications([]);
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    handleNotificationClick
  };
}
