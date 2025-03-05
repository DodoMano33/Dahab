
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface HelpDialogProps {
  showHelpDialog: boolean;
  setShowHelpDialog: (show: boolean) => void;
  resetOnboarding: () => Promise<void>;
}

export function HelpDialog({ 
  showHelpDialog, 
  setShowHelpDialog,
  resetOnboarding
}: HelpDialogProps) {
  return (
    <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>مساعدة ودليل استخدام التطبيق</DialogTitle>
          <DialogDescription>
            دليل سريع لاستخدام منصة تحليل الأسواق المالية
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">تحليل الرسوم البيانية</h3>
            <p className="text-sm text-muted-foreground">
              يمكنك تحليل الرسوم البيانية باستخدام عدة أنماط تحليلية مثل السكالبينج، SMC، ICT وغيرها. اختر رمز الزوج، الإطار الزمني، ونوع التحليل المطلوب ثم اضغط على زر "تحليل".
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">متابعة التحليلات</h3>
            <p className="text-sm text-muted-foreground">
              يمكنك متابعة التحليلات السابقة من خلال النقر على زر "سجل التحليلات". يعرض لك السجل جميع التحليلات مع إمكانية تصفيتها وفرزها.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">الإحصائيات</h3>
            <p className="text-sm text-muted-foreground">
              تعرض لوحة الإحصائيات أداء تحليلاتك حسب نوع التحليل والإطار الزمني، مما يساعدك على تحسين استراتيجيات التداول.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">الإشعارات</h3>
            <p className="text-sm text-muted-foreground">
              ستتلقى إشعارات عند تحقق أهداف التحليل أو تفعيل وقف الخسارة. يمكنك إدارة الإشعارات من خلال زر الجرس في شريط التنقل.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => setShowHelpDialog(false)}>
            فهمت
          </Button>
          <Button variant="outline" onClick={() => {
            setShowHelpDialog(false);
            resetOnboarding();
          }}>
            عرض جولة التعريف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
