
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Clock, Save } from "lucide-react";
import { toast } from "sonner";

interface AutoCheckSettingsProps {
  autoCheckConfig: {
    interval: number;
    isAutoCheckEnabled: boolean;
  };
  updateAutoCheckConfig: (config: { interval?: number; isAutoCheckEnabled?: boolean }) => void;
  toggleAutoCheck: () => void;
}

export const AutoCheckSettings = ({ 
  autoCheckConfig, 
  updateAutoCheckConfig, 
  toggleAutoCheck 
}: AutoCheckSettingsProps) => {
  const [interval, setInterval] = useState<string>(autoCheckConfig.interval.toString());
  
  const handleSaveSettings = () => {
    const parsedInterval = parseInt(interval);
    
    if (isNaN(parsedInterval) || parsedInterval < 5 || parsedInterval > 1440) {
      toast.error("الرجاء إدخال فاصل زمني صحيح (بين 5 و 1440 دقيقة)");
      return;
    }
    
    updateAutoCheckConfig({ interval: parsedInterval });
    toast.success("تم حفظ إعدادات الفحص التلقائي بنجاح");
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          إعدادات الفحص التلقائي
        </CardTitle>
        <CardDescription>
          ضبط إعدادات الفحص التلقائي للتحليلات
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-check-toggle" className="font-medium">
            تفعيل الفحص التلقائي
          </Label>
          <Switch
            id="auto-check-toggle"
            checked={autoCheckConfig.isAutoCheckEnabled}
            onCheckedChange={toggleAutoCheck}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="check-interval" className="font-medium">
            الفاصل الزمني (بالدقائق)
          </Label>
          <div className="flex gap-2">
            <Input
              id="check-interval"
              type="number"
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              min={5}
              max={1440}
              className="w-full"
            />
            <Button onClick={handleSaveSettings} size="sm">
              <Save className="h-4 w-4 mr-2" />
              حفظ
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            الحد الأدنى: 5 دقائق، الحد الأقصى: 1440 دقيقة (24 ساعة)
          </p>
        </div>
        
        <div className="text-sm text-muted-foreground mt-2 border-t pt-2">
          <p>
            {autoCheckConfig.isAutoCheckEnabled 
              ? `الفحص التلقائي مفعل، يتم الفحص كل ${autoCheckConfig.interval} دقيقة.`
              : 'الفحص التلقائي غير مفعل. فعله للحصول على تحديثات أوتوماتيكية.'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
