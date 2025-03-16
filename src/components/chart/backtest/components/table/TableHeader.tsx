
import { Checkbox } from "@/components/ui/checkbox";

interface TableHeaderProps {
  onSelectAll: (checked: boolean) => void;
  allSelected: boolean;
  itemsCount: number;
  showCurrentPrice?: boolean;
}

export const TableHeader = ({ 
  onSelectAll, 
  allSelected, 
  itemsCount,
  showCurrentPrice = true
}: TableHeaderProps) => {
  return (
    <div className="grid grid-cols-13 gap-1 p-2 bg-muted/50 text-right text-xs font-medium border-b sticky top-0 z-40">
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
      <div>النتيجة</div>
      <div>الربح/الخسارة</div>
      <div>السعر عند التحليل</div>
      <div>الهدف الأول</div>
      <div>وقف الخسارة</div>
      <div>أفضل نقطة دخول</div>
      <div>تاريخ النتيجة</div>
      <div>تاريخ التحليل</div>
      {showCurrentPrice && (
        <div className="text-center font-semibold text-primary">السعر الحالي</div>
      )}
    </div>
  );
};
