
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
    <div className="grid grid-cols-14 gap-1 p-2 bg-muted/50 text-right text-xs font-medium border-b sticky top-0 z-40">
      <div className="text-center flex items-center justify-center">
        <Checkbox 
          checked={allSelected && itemsCount > 0}
          onCheckedChange={onSelectAll}
        />
      </div>
      <div className="min-w-[110px] pl-2">تاريخ التحليل</div>
      <div className="pl-4">نوع التحليل</div>
      <div>الرمز</div>
      <div>الاطار الزمني</div>
      <div className="text-center -mr-3">الاتجاه</div>
      <div>الربح/الخسارة</div>
      <div className="-mr-2">مدة بقاء التحليل</div>
      <div>نقطة الدخول</div>
      <div>الهدف الأول</div>
      <div>وقف الخسارة</div>
      <div>أفضل نقطة دخول</div>
      <div className="min-w-[110px]">تاريخ النتيجة</div>
      <div className="text-center font-semibold text-primary">السعر الحالي</div>
    </div>
  );
};
