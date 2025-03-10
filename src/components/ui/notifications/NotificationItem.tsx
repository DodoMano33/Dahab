
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Notification } from "@/hooks/use-notifications";

interface NotificationItemProps {
  notification: Notification;
  onItemClick: (notification: Notification) => void;
  onDelete: (id: string) => void;
}

export function NotificationItem({ 
  notification, 
  onItemClick, 
  onDelete 
}: NotificationItemProps) {
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "success": return "نجاح";
      case "error": return "خطأ";
      case "warning": return "تحذير";
      case "info": return "معلومات";
      default: return "";
    }
  };

  return (
    <div
      className={`p-4 hover:bg-muted/50 cursor-pointer transition ${
        !notification.read ? "bg-muted/20" : ""
      }`}
      onClick={() => onItemClick(notification)}
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
              onDelete(notification.id);
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
          {getTypeLabel(notification.type)}
        </span>
        <time className="text-xs text-muted-foreground">
          {format(new Date(notification.created_at), "PPp", {
            locale: ar,
          })}
        </time>
      </div>
    </div>
  );
}
