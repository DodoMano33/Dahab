
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";

interface FeatureToggleProps {
  enabled: boolean;
  onToggle: (checked: boolean) => void;
  title: string;
  description: string;
}

export function FeatureToggle({ 
  enabled, 
  onToggle, 
  title, 
  description
}: FeatureToggleProps) {
  const [isChecked, setIsChecked] = useState(enabled);
  
  useEffect(() => {
    setIsChecked(enabled);
  }, [enabled]);
  
  const handleToggle = (checked: boolean) => {
    setIsChecked(checked);
    onToggle(checked);
  };
  
  return (
    <div className="flex items-center justify-between space-y-0">
      <div className="space-y-0.5">
        <Label>{title}</Label>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <Switch
        checked={isChecked}
        onCheckedChange={handleToggle}
        aria-label={title}
      />
    </div>
  );
}
