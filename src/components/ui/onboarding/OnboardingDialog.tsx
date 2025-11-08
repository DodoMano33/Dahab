
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

// خطوات التعريف بالتطبيق
const onboardingSteps = [
  {
    title: "مرحباً بك في منصة تحليل الأسواق المالية",
    description: "منصة متكاملة للتحليل الفني والاستراتيجي للأسواق المالية. سنأخذك في جولة سريعة للتعرف على الميزات الرئيسية.",
    image: "/onboarding/welcome.svg",
  },
  {
    title: "تحليل الرسوم البيانية",
    description: "استخدم أدوات التحليل المتقدمة لتحليل حركة الأسعار واكتشاف الفرص التجارية المحتملة بناءً على أنماط متعددة.",
    image: "/onboarding/chart.svg",
  },
  {
    title: "متابعة التحليلات",
    description: "راقب تحليلاتك السابقة وتتبع أدائها مع مرور الوقت لتحسين استراتيجيات التداول الخاصة بك.",
    image: "/onboarding/history.svg",
  },
  {
    title: "لوحة الإحصائيات",
    description: "احصل على نظرة عامة حول أداء تحليلاتك ونسب النجاح والاتجاهات العامة لمساعدتك في اتخاذ قرارات أفضل.",
    image: "/onboarding/dashboard.svg",
  },
  {
    title: "أنت الآن جاهز!",
    description: "يمكنك الآن البدء في استخدام المنصة. يمكنك دائماً العودة إلى هذا الدليل من إعدادات الملف الشخصي.",
    image: "/onboarding/ready.svg",
  },
];

export function OnboardingDialog() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      checkIfOnboardingCompleted();
    }
  }, [user]);

  const checkIfOnboardingCompleted = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error checking onboarding status:", error);
        return;
      }

      if (!data?.onboarding_completed) {
        setOpen(true);
      }
    } catch (error) {
      console.error("Error in checkIfOnboardingCompleted:", error);
    }
  };

  const markOnboardingComplete = async () => {
    try {
      if (!user) return;

      await supabase
        .from("profiles")
        .update({ onboarding_completed: true })
        .eq("id", user.id);
        
      setCompleted(true);
      setTimeout(() => {
        setOpen(false);
      }, 1500);
    } catch (error) {
      console.error("Error in markOnboardingComplete:", error);
    }
  };

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      markOnboardingComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    markOnboardingComplete();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden" dir="rtl">
        <div className="relative">
          {completed ? (
            <div className="flex flex-col items-center justify-center p-8 h-[400px]">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold">تم بنجاح!</h2>
              <p className="text-center text-muted-foreground mt-2">
                أنت الآن جاهز لاستخدام المنصة.
              </p>
            </div>
          ) : (
            <>
              <DialogHeader className="p-6 border-b">
                <DialogTitle className="text-xl">{onboardingSteps[currentStep].title}</DialogTitle>
                <DialogDescription>
                  {onboardingSteps[currentStep].description}
                </DialogDescription>
              </DialogHeader>

              <div className="flex justify-center items-center p-8 h-[300px] bg-muted/30">
                <div className="w-3/4 h-full flex items-center justify-center">
                  <img 
                    src={onboardingSteps[currentStep].image} 
                    alt={onboardingSteps[currentStep].title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>

              <DialogFooter className="p-6 border-t flex-row justify-between">
                <div>
                  {currentStep > 0 && (
                    <Button variant="outline" onClick={handlePrevious}>
                      <ChevronRight className="ml-2 h-4 w-4" />
                      السابق
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  {currentStep < onboardingSteps.length - 1 && (
                    <Button variant="ghost" onClick={handleSkip}>
                      تخطي
                    </Button>
                  )}
                  <Button onClick={handleNext}>
                    {currentStep === onboardingSteps.length - 1 ? "إنهاء" : "التالي"}
                    {currentStep < onboardingSteps.length - 1 && (
                      <ChevronLeft className="mr-2 h-4 w-4" />
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
