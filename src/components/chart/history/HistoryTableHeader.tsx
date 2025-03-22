
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface HistoryTableHeaderProps {
  showCheckbox?: boolean;
  onSelectAll?: (checked: boolean) => void;
  isAllSelected?: boolean;
}

export const HistoryTableHeader = ({
  showCheckbox,
  onSelectAll,
  isAllSelected
}: HistoryTableHeaderProps) => {
  return (
    <TableHeader className="sticky top-0 bg-background z-30 border-b shadow-sm">
      <TableRow>
        {showCheckbox && (
          <TableHead className="w-10 text-center">
            <Checkbox 
              checked={isAllSelected}
              onCheckedChange={onSelectAll}
              aria-label="تحديد كل العناصر"
            />
          </TableHead>
        )}
        <TableHead className="text-center w-36">تاريخ التحليل</TableHead>
        <TableHead className="text-center w-28">نوع التحليل</TableHead>
        <TableHead className="text-center w-16">الرمز</TableHead>
        <TableHead className="text-center w-20">الإطار الزمني</TableHead>
        <TableHead className="text-center w-16">الاتجاه</TableHead>
        <TableHead className="text-center w-16">سعر الدخول</TableHead>
        <TableHead className="text-center w-20">وقف الخسارة</TableHead>
        <TableHead className="text-center w-24">الأهداف</TableHead>
        <TableHead className="text-center w-24">أفضل نقطة دخول</TableHead>
        <TableHead className="text-center w-20">الوقت المتبقي</TableHead>
        <TableHead className="text-center w-24">آخر فحص</TableHead>
        <TableHead className="text-center w-16">حالة السوق</TableHead>
      </TableRow>
    </TableHeader>
  );
};
