
import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: Date;
  type: "success" | "error" | "info" | "warning";
  link?: string;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchNotifications();
      setupRealtimeSubscription();
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
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Error fetching notifications:", error);
        return;
      }

      setNotifications(data as Notification[]);
    } catch (error) {
      console.error("Error in fetchNotifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user) return;

    const channel = supabase
      .channel("notifications_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Notification change:", payload);
          
          if (payload.eventType === "INSERT") {
            // إضافة إشعار جديد
            setNotifications(prev => [payload.new as Notification, ...prev]);
            toast(payload.new.title, {
              description: payload.new.message,
              action: {
                label: "عرض",
                onClick: () => handleNotificationClick(payload.new as Notification),
              },
            });
          } else if (payload.eventType === "UPDATE") {
            // تحديث إشعار
            setNotifications(prev => 
              prev.map(n => n.id === payload.new.id ? payload.new as Notification : n)
            );
          } else if (payload.eventType === "DELETE") {
            // حذف إشعار
            setNotifications(prev => 
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

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", id);

      if (error) {
        console.error("Error marking notification as read:", error);
        return;
      }

      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error("Error in markAsRead:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user?.id);

      if (error) {
        console.error("Error marking all notifications as read:", error);
        return;
      }

      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error("Error in markAllAsRead:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting notification:", error);
        return;
      }

      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error("Error in deleteNotification:", error);
    }
  };

  const deleteAllNotifications = async () => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("user_id", user?.id);

      if (error) {
        console.error("Error deleting all notifications:", error);
        return;
      }

      setNotifications([]);
    } catch (error) {
      console.error("Error in deleteAllNotifications:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    if (notification.link) {
      navigate(notification.link);
    }
    
    setOpen(false);
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "info":
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px]">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[350px] p-0" dir="rtl">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-medium">الإشعارات</h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="text-xs h-8"
            >
              تعليم الكل كمقروء
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={deleteAllNotifications}
              disabled={notifications.length === 0}
              className="text-xs h-8"
            >
              حذف الكل
            </Button>
          </div>
        </div>
        {isLoading ? (
          <div className="p-4 text-center">جاري التحميل...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            لا توجد إشعارات
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 cursor-pointer transition ${
                    !notification.read ? "bg-muted/20" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium flex items-center gap-2">
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${
                          !notification.read ? "bg-primary" : "bg-transparent"
                        }`}
                      ></span>
                      {notification.title}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <span className="sr-only">حذف</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 6 6 18"></path>
                          <path d="m6 6 12 12"></path>
                        </svg>
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getNotificationTypeColor(
                        notification.type
                      )}`}
                    >
                      {notification.type === "success" && "نجاح"}
                      {notification.type === "error" && "خطأ"}
                      {notification.type === "warning" && "تحذير"}
                      {notification.type === "info" && "معلومات"}
                    </span>
                    <time className="text-xs text-muted-foreground">
                      {format(new Date(notification.created_at), "PPp", {
                        locale: ar,
                      })}
                    </time>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}
