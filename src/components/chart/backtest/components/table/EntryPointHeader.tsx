
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
    <div className="grid grid-cols-14 p-2 bg-muted/50 text-right text-xs font-medium border-b sticky top-0 z-40">
      <div className="text-center flex items-center justify-center">
        <Checkbox 
          checked={allSelected && itemsCount > 0}
          onCheckedChange={onSelectAll}
        />
      </div>
      <div className="whitespace-nowrap px-2">تاريخ التحليل</div>
      <div className="whitespace-nowrap px-2">نوع التحليل</div>
      <div className="whitespace-nowrap px-2">الرمز</div>
      <div className="whitespace-nowrap px-2">الاطار الزمني</div>
      <div className="text-center px-2">الاتجاه</div>
      <div className="whitespace-nowrap px-2">الربح/الخسارة</div>
      <div className="whitespace-nowrap px-2">مدة بقاء التحليل</div>
      <div className="whitespace-nowrap px-2">نقطة الدخول</div>
      <div className="whitespace-nowrap px-2">الهدف الأول</div>
      <div className="whitespace-nowrap px-2">وقف الخسارة</div>
      <div className="whitespace-nowrap px-2">أفضل نقطة دخول</div>
      <div className="whitespace-nowrap px-2">تاريخ النتيجة</div>
      <div className="text-center font-semibold text-primary px-2">السعر الحالي</div>
    </div>
  );
};
