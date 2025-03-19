
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ActionButtonsProps {
  resetOnboarding: () => Promise<void>;
}

export function ActionButtons({ resetOnboarding }: ActionButtonsProps) {
  const [isResetting, setIsResetting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  
  const handleResetOnboarding = async () => {
    setIsResetting(true);
    try {
      await resetOnboarding();
    } finally {
      setIsResetting(false);
    }
  };
  
  const handleClearAnalytics = () => {
    setIsClearing(true);
    // هنا سنقوم بتنفيذ إجراء توضيحي بدون حذف البيانات فعليًا
    setTimeout(() => {
      setIsClearing(false);
      // نظهر رسالة للمستخدم بأن هذه الميزة سيتم تفعيلها لاحقًا
      alert("هذه الميزة ستكون متاحة في تحديث قادم");
    }, 1000);
  };
  
  return (
    <div className="space-y-2 pt-4">
      <Button
        variant="outline"
        onClick={handleResetOnboarding}
        className="w-full"
        disabled={isResetting}
      >
        {isResetting ? "جاري إعادة التعيين..." : "إعادة تشغيل جولة التعريف"}
      </Button>
      
      <Button
        variant="outline"
        className="w-full"
        onClick={handleClearAnalytics}
        disabled={isClearing}
      >
        {isClearing ? "جاري المسح..." : "مسح سجل التحليلات"}
      </Button>
    </div>
  );
}
