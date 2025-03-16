
import { Button } from "@/components/ui/button";

interface AdditionalSettingsProps {
  resetOnboarding: () => Promise<void>;
}

export function AdditionalSettings({ resetOnboarding }: AdditionalSettingsProps) {
  return (
    <div className="space-y-2 pt-4 border-t mt-2">
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
  );
}
