import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface HistoryTableHeaderProps {
  showCheckbox?: boolean;
  onSelectAll?: () => void;
  isAllSelected?: boolean;
}

export const HistoryTableHeader = ({
  showCheckbox = false,
  onSelectAll,
  isAllSelected
}: HistoryTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        {showCheckbox && (
          <TableHead className="w-[60px] text-center">
            <Checkbox 
              checked={isAllSelected} 
              onCheckedChange={onSelectAll}
            />
          </TableHead>
        )}
        <TableHead className="w-[120px] text-center">التاريخ</TableHead>
        <TableHead className="w-[100px] text-center">الرمز</TableHead>
        <TableHead className="w-[120px] text-center">نوع التحليل</TableHead>
        <TableHead className="w-[100px] text-center">الإطار الزمني</TableHead>
        <TableHead className="w-[120px] text-center">السعر الحالي</TableHead>
        <TableHead className="w-[80px] text-center">الاتجاه</TableHead>
        <TableHead className="w-[160px] text-center">نقطة الدخول</TableHead>
        <TableHead className="w-[140px] text-center">الأهداف</TableHead>
        <TableHead className="w-[120px] text-center">وقف الخسارة</TableHead>
      </TableRow>
    </TableHeader>
  );
};