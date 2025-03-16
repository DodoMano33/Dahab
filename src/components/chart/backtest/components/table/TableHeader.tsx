
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
          <TableHead className="w-[50px]">
            <Checkbox 
              checked={allSelected}
              onCheckedChange={onSelectAll}
              aria-label="Select all"
            />
          </TableHead>
        )}
        <TableHead className="text-center w-[80px]">الرمز</TableHead>
        <TableHead className="text-center w-[80px]">الربح/الخسارة</TableHead>
        <TableHead className="text-center w-[80px]">الاتجاه</TableHead>
        <TableHead className="text-center w-[80px]">سعر الدخول</TableHead>
        <TableHead className="text-center w-[80px]">سعر الخروج</TableHead>
        <TableHead className="text-center w-[80px]">الهدف</TableHead>
        <TableHead className="text-center w-[80px]">وقف الخسارة</TableHead>
        <TableHead className="text-center w-[80px]">النتيجة</TableHead>
        <TableHead className="text-center w-[80px]">الإطار الزمني</TableHead>
        <TableHead className="text-center w-[100px]">نوع التحليل</TableHead>
        <TableHead className="text-center w-[150px]">تاريخ التحليل</TableHead>
        <TableHead className="text-center w-[150px]">تاريخ النتيجة</TableHead>
      </TableRow>
    </UITableHeader>
  );
};
