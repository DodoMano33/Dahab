
import { AlertCircle } from "lucide-react";
import { Alert } from "@/components/ui/alert";

export function AlphaVantageSettings() {
  return (
    <div className="border-t pt-4 mt-2">
      <div className="space-y-1 mb-4">
        <h3 className="font-medium text-base">إعدادات أسعار الذهب</h3>
        <p className="text-sm text-muted-foreground">
          تم إزالة جميع مصادر الأسعار من التطبيق
        </p>
      </div>
      
      <div className="bg-amber-50 text-amber-800 p-4 rounded-md mb-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <div>
            <p className="font-medium">تنبيه: تم إزالة نظام الأسعار</p>
            <p className="text-sm mt-1">
              تم إزالة جميع مصادر الأسعار وخدمات استخراج الأسعار نهائياً من التطبيق.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
