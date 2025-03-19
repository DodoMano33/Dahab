
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface FeatureToggleProps {
  enabled: boolean;
  onToggle: (checked: boolean) => void;
  title: string;
  description: string;
  onToggleMessage?: {
    enable?: string;
    disable?: string;
  };
  defaultChecked?: boolean;
}

export function FeatureToggle({ 
  enabled, 
  onToggle, 
  title, 
  description,
  onToggleMessage,
  defaultChecked
}: FeatureToggleProps) {
  const handleToggle = (checked: boolean) => {
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
        checked={enabled}
        onCheckedChange={handleToggle}
        defaultChecked={defaultChecked}
        aria-label={title}
      />
    </div>
  );
}
