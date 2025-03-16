
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
    <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 text-right text-sm font-medium border-b sticky top-0 z-40">
      <div className="text-center flex items-center justify-center">
        <Checkbox 
          checked={allSelected && itemsCount > 0}
          onCheckedChange={onSelectAll}
        />
      </div>
      <div>نوع التحليل</div>
      <div>الرمز</div>
      <div>الاطار الزمني</div>
      <div className="text-center">الاتجاه</div>
      <div>الربح/الخسارة</div>
      <div>سعر الخروج</div>
      <div>نقطة الدخول</div>
      <div>الهدف الأول</div>
      <div>وقف الخسارة</div>
      <div>تاريخ النتيجة</div>
      <div className="text-center font-semibold text-primary">السعر الحالي</div>
    </div>
  );
};
