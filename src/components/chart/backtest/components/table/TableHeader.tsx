
import { TableHead, TableHeader as UITableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface TableHeaderProps {
  onSelectAll?: (checked: boolean) => void;
  allSelected?: boolean;
}

export const BacktestTableHeader = ({ 
  onSelectAll, 
  allSelected = false 
}: TableHeaderProps = {}) => {
  return (
    <UITableHeader>
      <TableRow>
        {onSelectAll && (
          <TableHead className="w-[40px] text-center">
            <Checkbox 
              checked={allSelected}
              onCheckedChange={onSelectAll}
              aria-label="Select all"
            />
          </TableHead>
        )}
        <TableHead className="text-center w-[85px]">تاريخ التحليل</TableHead>
        <TableHead className="text-center w-[85px]">نوع التحليل</TableHead>
        <TableHead className="text-center w-[70px]">الرمز</TableHead>
        <TableHead className="text-center w-[60px]">الإطار الزمني</TableHead>
        <TableHead className="text-center w-[60px]">الاتجاه</TableHead>
        <TableHead className="text-center w-[60px]">النتيجة</TableHead>
        <TableHead className="text-center w-[80px]">مدة بقاء التحليل</TableHead>
        <TableHead className="text-center w-[70px]">الربح/الخسارة</TableHead>
        <TableHead className="text-center w-[70px]">سعر الدخول</TableHead>
        <TableHead className="text-center w-[70px]">الهدف</TableHead>
        <TableHead className="text-center w-[70px]">وقف الخسارة</TableHead>
        <TableHead className="text-center w-[70px]">أفضل نقطة دخول</TableHead>
        <TableHead className="text-center w-[85px]">تاريخ النتيجة</TableHead>
        <TableHead className="text-center w-[70px]">السعر الحالي</TableHead>
      </TableRow>
    </UITableHeader>
  );
};
