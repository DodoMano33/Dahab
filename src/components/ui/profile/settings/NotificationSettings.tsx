
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface NotificationSettingsProps {
  notificationsEnabled: boolean;
  autoCheckEnabled: boolean;
  onNotificationsChange: (checked: boolean) => void;
  onAutoCheckChange: (checked: boolean) => void;
}

export function NotificationSettings({
  notificationsEnabled,
  autoCheckEnabled,
  onNotificationsChange,
  onAutoCheckChange
}: NotificationSettingsProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>الإشعارات</Label>
          <p className="text-sm text-muted-foreground">
            تلقي إشعارات عند تحقق الأهداف ووقف الخسارة
          </p>
        </div>
        <Switch
          checked={notificationsEnabled}
          onCheckedChange={onNotificationsChange}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>الفحص التلقائي</Label>
          <p className="text-sm text-muted-foreground">
            فحص تلقائي للتحليلات ومقارنتها بالأسعار الحالية كل 5 دقائق
          </p>
        </div>
        <Switch
          checked={autoCheckEnabled}
          onCheckedChange={onAutoCheckChange}
        />
      </div>
    </>
  );
}
