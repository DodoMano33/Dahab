
import { Checkbox } from "@/components/ui/checkbox";

interface EntryPointHeaderProps {
  onSelectAll: (checked: boolean) => void;
  allSelected: boolean;
  itemsCount: number;
}

export const EntryPointHeader = ({ 
  onSelectAll, 
  allSelected, 
  itemsCount
}: EntryPointHeaderProps) => {
  return (
    <div className="grid grid-cols-[40px_120px_80px_100px_80px_100px_100px_100px_100px_100px_140px_140px_auto] gap-2 p-2 bg-muted/50 text-right text-xs font-medium border-b sticky top-0 z-40 min-w-[1400px]">
      <div className="text-center flex items-center justify-center">
        <Checkbox 
          checked={allSelected && itemsCount > 0}
          onCheckedChange={onSelectAll}
        />
      </div>
      <div className="px-2">نوع التحليل</div>
      <div className="px-2">الرمز</div>
      <div className="px-2">الاطار الزمني</div>
      <div className="text-center px-2">الاتجاه</div>
      <div className="px-2">الربح/الخسارة</div>
      <div className="px-2">سعر الخروج</div>
      <div className="px-2">نقطة الدخول</div>
      <div className="px-2">الهدف الأول</div>
      <div className="px-2">وقف الخسارة</div>
      <div className="px-2">تاريخ النتيجة</div>
      <div className="px-2">تاريخ إنشاء التحليل</div>
      <div className="text-center font-semibold text-primary px-2">السعر الحالي</div>
    </div>
  );
};
