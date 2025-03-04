
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, ChevronLeft, ChevronRight, Info } from "lucide-react";

interface OnboardingStep {
  title: string;
  description: string;
  image?: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: "مرحباً بك في منصة تحليل الأسواق المالية",
    description: "منصة متكاملة تساعدك على تحليل الأسواق المالية واتخاذ القرارات الاستثمارية الصحيحة."
  },
  {
    title: "إجراء التحليلات",
    description: "قم بتحليل الأسعار باستخدام مختلف أنواع التحليل الفني مثل نماذج الأنماط، وموجات إليوت، وSMC وغيرها."
  },
  {
    title: "متابعة الأداء",
    description: "تتبع أداء تحليلاتك ومعرفة نسب نجاحك وتحسين استراتيجياتك الاستثمارية."
  },
  {
    title: "لوحة الإحصائيات",
    description: "احصل على إحصائيات مفصلة عن أدائك وتعرف على نقاط القوة والضعف في تحليلاتك."
  }
];

export function OnboardingDialog() {
  const [open, setOpen] = useState(() => {
    // افتح الإرشادات تلقائياً للمستخدمين الجدد فقط
    return localStorage.getItem("onboarding-completed") !== "true";
  });
  
  const [currentStep, setCurrentStep] = useState(0);

  const handleNextStep = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    localStorage.setItem("onboarding-completed", "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {ONBOARDING_STEPS[currentStep].title}
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4" 
            onClick={completeOnboarding}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="py-8">
          <DialogDescription className="text-center text-base mb-6">
            {ONBOARDING_STEPS[currentStep].description}
          </DialogDescription>
          
          {ONBOARDING_STEPS[currentStep].image && (
            <div className="flex justify-center mb-6">
              <img 
                src={ONBOARDING_STEPS[currentStep].image} 
                alt={ONBOARDING_STEPS[currentStep].title} 
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          )}
          
          <div className="flex justify-center">
            <div className="flex gap-1">
              {ONBOARDING_STEPS.map((_, index) => (
                <div 
                  key={index}
                  className={`w-2 h-2 rounded-full ${index === currentStep ? 'bg-primary' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={currentStep === 0}
          >
            <ChevronRight className="ml-2 h-4 w-4" />
            السابق
          </Button>
          
          <Button onClick={completeOnboarding} variant="ghost">
            تخطي الإرشادات
          </Button>
          
          <Button onClick={handleNextStep}>
            {currentStep < ONBOARDING_STEPS.length - 1 ? (
              <>
                التالي
                <ChevronLeft className="mr-2 h-4 w-4" />
              </>
            ) : (
              "إنهاء"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function HelpButton() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={() => setOpen(true)}
      >
        <Info className="h-4 w-4" />
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>دليل استخدام المنصة</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="analysis">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="analysis">التحليل</TabsTrigger>
              <TabsTrigger value="history">السجل</TabsTrigger>
              <TabsTrigger value="stats">الإحصائيات</TabsTrigger>
              <TabsTrigger value="settings">الإعدادات</TabsTrigger>
            </TabsList>
            
            <TabsContent value="analysis" className="mt-4">
              <h3 className="text-lg font-medium mb-2">إجراء التحليلات</h3>
              <p className="mb-4">لإجراء تحليل جديد، قم باتباع الخطوات التالية:</p>
              <ol className="list-decimal list-inside space-y-2 mr-4">
                <li>اختر الرمز (مثل EURUSD أو XAUUSD)</li>
                <li>حدد الإطار الزمني المناسب (1m، 5m، 30m، 1h، 4h، 1d)</li>
                <li>أدخل السعر الحالي</li>
                <li>اختر نوع التحليل المطلوب (نماذج، موجات، SMC، إلخ)</li>
                <li>انقر على زر "تحليل" وانتظر النتائج</li>
              </ol>
            </TabsContent>
            
            <TabsContent value="history" className="mt-4">
              <h3 className="text-lg font-medium mb-2">سجل التحليلات</h3>
              <p>يمكنك عرض تحليلاتك السابقة والاطلاع على نتائجها من خلال:</p>
              <ul className="list-disc list-inside space-y-2 mr-4 mt-2">
                <li>النقر على زر "السجل" لعرض جميع التحليلات السابقة</li>
                <li>تصفية التحليلات حسب الرمز أو نوع التحليل</li>
                <li>الاطلاع على تفاصيل كل تحليل وحالة الأهداف ووقف الخسارة</li>
              </ul>
            </TabsContent>
            
            <TabsContent value="stats" className="mt-4">
              <h3 className="text-lg font-medium mb-2">الإحصائيات والتقارير</h3>
              <p>يمكنك عرض إحصائيات أدائك من خلال:</p>
              <ul className="list-disc list-inside space-y-2 mr-4 mt-2">
                <li>الانتقال إلى تبويب "الإحصائيات" لعرض نسب النجاح</li>
                <li>الاطلاع على أفضل أنواع التحليل أداءً</li>
                <li>تتبع أداء التحليلات حسب الإطار الزمني</li>
              </ul>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-4">
              <h3 className="text-lg font-medium mb-2">الإعدادات</h3>
              <p>يمكنك تخصيص إعدادات التطبيق من خلال:</p>
              <ul className="list-disc list-inside space-y-2 mr-4 mt-2">
                <li>تغيير السمة (الوضع الفاتح/المظلم)</li>
                <li>تخصيص إعدادات الإشعارات</li>
                <li>تعديل إعدادات العرض والتنسيق</li>
              </ul>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>إغلاق</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
