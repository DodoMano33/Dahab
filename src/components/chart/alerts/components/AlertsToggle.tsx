
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AlertsToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const AlertsToggle: React.FC<AlertsToggleProps> = ({ enabled, onToggle }) => {
  return (
    <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
      <Switch 
        id="alerts-active" 
        checked={enabled}
        onCheckedChange={onToggle}
      />
      <Label htmlFor="alerts-active">تفعيل التنبيهات</Label>
    </div>
  );
};
