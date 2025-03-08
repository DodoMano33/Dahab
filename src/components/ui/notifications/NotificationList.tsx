
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationItem } from "./NotificationItem";
import { Notification } from "@/hooks/notifications";

interface NotificationListProps {
  notifications: Notification[];
  isLoading: boolean;
  onItemClick: (notification: Notification) => void;
  onDelete: (id: string) => void;
}

export function NotificationList({
  notifications,
  isLoading,
  onItemClick,
  onDelete
}: NotificationListProps) {
  if (isLoading) {
    return <div className="p-4 text-center">جاري التحميل...</div>;
  }

  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        لا توجد إشعارات
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="divide-y">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onItemClick={onItemClick}
            onDelete={onDelete}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
