
import { Button } from "@/components/ui/button";

interface NotificationsHeaderProps {
  unreadCount: number;
  notificationsCount: number;
  onMarkAllAsRead: () => void;
  onDeleteAll: () => void;
}

export function NotificationsHeader({
  unreadCount,
  notificationsCount,
  onMarkAllAsRead,
  onDeleteAll
}: NotificationsHeaderProps) {
  return (
    <div className="p-4 border-b flex items-center justify-between">
      <h3 className="font-medium">الإشعارات</h3>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={onMarkAllAsRead}
          disabled={unreadCount === 0}
          className="text-xs h-8"
        >
          تعليم الكل كمقروء
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onDeleteAll}
          disabled={notificationsCount === 0}
          className="text-xs h-8"
        >
          حذف الكل
        </Button>
      </div>
    </div>
  );
}
