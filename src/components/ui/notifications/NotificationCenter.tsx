
import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationsHeader } from "./NotificationsHeader";
import { NotificationList } from "./NotificationList";
import { useNotifications } from "@/hooks/notifications";

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const { user, isLoggedIn } = useAuth();
  
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    handleNotificationClick
  } = useNotifications();

  if (!isLoggedIn) {
    return null;
  }

  const handleNotificationItemClick = (notification: any) => {
    handleNotificationClick(notification);
    setOpen(false);
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
        <NotificationsHeader
          unreadCount={unreadCount}
          notificationsCount={notifications.length}
          onMarkAllAsRead={markAllAsRead}
          onDeleteAll={deleteAllNotifications}
        />
        <NotificationList
          notifications={notifications}
          isLoading={isLoading}
          onItemClick={handleNotificationItemClick}
          onDelete={deleteNotification}
        />
      </PopoverContent>
    </Popover>
  );
}
