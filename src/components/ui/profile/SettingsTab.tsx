
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface SettingsTabProps {
  userProfile: {
    notificationsEnabled: boolean;
    autoCheckEnabled: boolean;
    autoCheckInterval: number;
  };
  setUserProfile: (profile: any) => void;
  resetOnboarding: () => Promise<void>;
}

export function SettingsTab({ 
  userProfile, 
  setUserProfile,
  resetOnboarding 
}: SettingsTabProps) {
  return (
    <div className="grid gap-4 py-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>الإشعارات</Label>
          <p className="text-sm text-muted-foreground">
            تلقي إشعارات عند تحقق الأهداف ووقف الخسارة
          </p>
        </div>
        <Switch
          checked={userProfile.notificationsEnabled}
          onCheckedChange={(checked) => setUserProfile({ ...userProfile, notificationsEnabled: checked })}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>الفحص التلقائي</Label>
          <p className="text-sm text-muted-foreground">
            فحص تلقائي للتحليلات ومقارنتها بالأسعار الحالية
          </p>
        </div>
        <Switch
          checked={userProfile.autoCheckEnabled}
          onCheckedChange={(checked) => setUserProfile({ ...userProfile, autoCheckEnabled: checked })}
        />
      </div>
      
      {userProfile.autoCheckEnabled && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="checkInterval" className="text-right">
            الفاصل الزمني (دقائق)
          </Label>
          <Input
            id="checkInterval"
            type="number"
            min={5}
            max={120}
            value={userProfile.autoCheckInterval}
            onChange={(e) => setUserProfile({ 
              ...userProfile, 
              autoCheckInterval: parseInt(e.target.value) || 30
            })}
            className="col-span-3"
          />
        </div>
      )}
      
      <div className="space-y-2 pt-4">
        <Button
          variant="outline"
          onClick={resetOnboarding}
          className="w-full"
        >
          إعادة تشغيل جولة التعريف
        </Button>
        
        <Button
          variant="outline"
          className="w-full"
        >
          مسح سجل التحليلات
        </Button>
      </div>
    </div>
  );
}
