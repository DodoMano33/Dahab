
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Notification } from "./types";
import { useRealTimeNotifications } from "./use-real-time-notifications";
import { 
  fetchUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteUserNotification,
  deleteAllUserNotifications
} from "./notification-utils";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch notifications on mount and when user changes
  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  // Update unread count when notifications change
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  // Load notifications from the server
  const loadNotifications = async () => {
    if (!user) return;

    setIsLoading(true);
    const data = await fetchUserNotifications(user.id);
    setNotifications(data);
    setIsLoading(false);
  };

  // Handle notification click
  const handleNotificationClick = async (notification: Notification) => {
    await markAsRead(notification.id);
    
    if (notification.link) {
      navigate(notification.link);
    }
  };

  // Mark notification as read
  const markAsRead = async (id: string) => {
    const success = await markNotificationAsRead(id);
    if (success) {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user) return;
    
    const success = await markAllNotificationsAsRead(user.id);
    if (success) {
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
    }
  };

  // Delete a notification
  const deleteNotification = async (id: string) => {
    const success = await deleteUserNotification(id);
    if (success) {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  // Delete all notifications
  const deleteAllNotifications = async () => {
    if (!user) return;
    
    const success = await deleteAllUserNotifications(user.id);
    if (success) {
      setNotifications([]);
    }
  };

  // Set up real-time subscription
  useRealTimeNotifications(
    user?.id,
    setNotifications,
    handleNotificationClick
  );

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
