
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
          <TableHead className="w-[50px] text-center">
            <Checkbox 
              checked={allSelected}
              onCheckedChange={onSelectAll}
              aria-label="Select all"
            />
          </TableHead>
        )}
        <TableHead className="text-center w-[150px]">تاريخ التحليل</TableHead>
        <TableHead className="text-center w-[120px]">نوع التحليل</TableHead>
        <TableHead className="text-center w-[100px]">الرمز</TableHead>
        <TableHead className="text-center w-[100px]">الإطار الزمني</TableHead>
        <TableHead className="text-center w-[100px]">النتيجة</TableHead>
        <TableHead className="text-center w-[120px]">مدة بقاء التحليل</TableHead>
        <TableHead className="text-center w-[100px]">الربح/الخسارة</TableHead>
        <TableHead className="text-center w-[100px]">سعر الدخول</TableHead>
        <TableHead className="text-center w-[100px]">الهدف</TableHead>
        <TableHead className="text-center w-[100px]">وقف الخسارة</TableHead>
        <TableHead className="text-center w-[100px]">أفضل نقطة دخول</TableHead>
        <TableHead className="text-center w-[150px]">تاريخ النتيجة</TableHead>
        <TableHead className="text-center w-[100px]">السعر الحالي</TableHead>
      </TableRow>
    </UITableHeader>
  );
};
