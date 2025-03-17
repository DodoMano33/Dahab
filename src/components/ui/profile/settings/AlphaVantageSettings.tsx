
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Alert } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function AlphaVantageSettings() {
  return (
    <div className="border-t pt-4 mt-2">
      <div className="space-y-1 mb-4">
        <h3 className="font-medium text-base">إعدادات أسعار الذهب</h3>
        <p className="text-sm text-muted-foreground">
          تكوين كيفية الحصول على أسعار الذهب المباشرة
        </p>
      </div>
      
      <div className="bg-amber-50 text-amber-800 p-4 rounded-md mb-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <div>
            <p className="font-medium">تنبيه: تم تبسيط نظام الأسعار</p>
            <p className="text-sm mt-1">
              تم تعطيل Alpha Vantage API وحصر الحصول على الأسعار من خلال استخراجها من الشارت مباشرة.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4 opacity-60">
        <div className="space-y-0.5">
          <Label htmlFor="alphaVantageToggle">استخدام Alpha Vantage API</Label>
          <p className="text-sm text-muted-foreground">
            الحصول على سعر الذهب المباشر من Alpha Vantage (غير مفعل)
          </p>
        </div>
        <Switch
          id="alphaVantageToggle"
          checked={false}
          disabled={true}
        />
      </div>
      
      <div className="space-y-2 opacity-60">
        <Label htmlFor="alphaVantageKey">مفتاح Alpha Vantage API (غير مستخدم)</Label>
        <div className="flex gap-2">
          <Input
            id="alphaVantageKey"
            value=""
            disabled={true}
            placeholder="غير مستخدم حاليًا"
            className="flex-grow"
            dir="ltr"
          />
          <Button disabled={true} type="button" variant="secondary">
            حفظ
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          تم تعطيل هذه الميزة حاليًا. يتم الحصول على الأسعار من الشارت فقط.
        </p>
      </div>
    </div>
  );
}
