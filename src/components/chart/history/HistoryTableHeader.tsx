
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
      <TableRow className="bg-muted/50 hover:bg-muted/50 h-14">
        {showCheckbox && (
          <TableHead className="w-10 text-center">
            <Checkbox 
              checked={isAllSelected}
              onCheckedChange={onSelectAll}
              aria-label="تحديد كل العناصر"
              className="mx-auto"
            />
          </TableHead>
        )}
        <TableHead className="text-center w-36 font-bold text-primary">تاريخ التحليل</TableHead>
        <TableHead className="text-center w-28 font-bold text-primary">نوع التحليل</TableHead>
        <TableHead className="text-center w-16 font-bold text-primary">الرمز</TableHead>
        <TableHead className="text-center w-20 font-bold text-primary">الإطار الزمني</TableHead>
        <TableHead className="text-center w-16 font-bold text-primary">الاتجاه</TableHead>
        <TableHead className="text-center w-16 font-bold text-primary">سعر الدخول</TableHead>
        <TableHead className="text-center w-20 font-bold text-primary">وقف الخسارة</TableHead>
        <TableHead className="text-center w-24 font-bold text-primary">الأهداف</TableHead>
        <TableHead className="text-center w-24 font-bold text-primary">أفضل نقطة دخول</TableHead>
        <TableHead className="text-center w-20 font-bold text-primary">الوقت المتبقي</TableHead>
        <TableHead className="text-center w-24 font-bold text-primary">آخر فحص</TableHead>
        <TableHead className="text-center w-16 font-bold text-primary">حالة السوق</TableHead>
      </TableRow>
    </TableHeader>
  );
};
