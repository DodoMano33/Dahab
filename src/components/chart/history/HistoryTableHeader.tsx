
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
    <TableHeader className="sticky top-0 bg-background z-30 border-b shadow-md">
      <TableRow className="bg-muted/40 hover:bg-muted/40">
        {showCheckbox && (
          <TableHead className="w-10 text-center">
            <Checkbox 
              checked={isAllSelected}
              onCheckedChange={onSelectAll}
              aria-label="تحديد كل العناصر"
            />
          </TableHead>
        )}
        <TableHead className="text-center w-36 font-bold">تاريخ التحليل</TableHead>
        <TableHead className="text-center w-28 font-bold">نوع التحليل</TableHead>
        <TableHead className="text-center w-16 font-bold">الرمز</TableHead>
        <TableHead className="text-center w-20 font-bold">الإطار الزمني</TableHead>
        <TableHead className="text-center w-16 font-bold">الاتجاه</TableHead>
        <TableHead className="text-center w-16 font-bold">سعر الدخول</TableHead>
        <TableHead className="text-center w-20 font-bold">وقف الخسارة</TableHead>
        <TableHead className="text-center w-24 font-bold">الأهداف</TableHead>
        <TableHead className="text-center w-24 font-bold">أفضل نقطة دخول</TableHead>
        <TableHead className="text-center w-20 font-bold">الوقت المتبقي</TableHead>
        <TableHead className="text-center w-24 font-bold">آخر فحص</TableHead>
        <TableHead className="text-center w-16 font-bold">حالة السوق</TableHead>
      </TableRow>
    </TableHeader>
  );
};
