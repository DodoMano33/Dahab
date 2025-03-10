
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface HistoryTableHeaderProps {
  showCheckbox?: boolean;
  isAllSelected?: boolean;
  onSelectAll?: () => void;
}

export const HistoryTableHeader = ({
  showCheckbox,
  isAllSelected,
  onSelectAll
}: HistoryTableHeaderProps) => {
  return (
    <TableHeader className="sticky top-0 bg-background z-30 border-b shadow-sm">
      <TableRow>
        {showCheckbox && (
          <TableHead className="w-10 p-2">
            {onSelectAll && (
              <div className="flex items-center justify-center">
                <Checkbox 
                  checked={isAllSelected} 
                  onCheckedChange={onSelectAll}
                  aria-label="تحديد كل العناصر"
                />
              </div>
            )}
          </TableHead>
        )}
        <TableHead className="w-16">حالة السوق</TableHead>
        <TableHead className="w-24">آخر فحص</TableHead>
        <TableHead className="w-20">الوقت المتبقي</TableHead>
        <TableHead className="w-24">أفضل نقطة دخول</TableHead>
        <TableHead className="w-24">الأهداف</TableHead>
        <TableHead className="w-20">وقف الخسارة</TableHead>
        <TableHead className="w-16">الاتجاه</TableHead>
        <TableHead className="w-16">سعر الدخول</TableHead>
        <TableHead className="w-28">نوع التحليل</TableHead>
        <TableHead className="w-20">الإطار الزمني</TableHead>
        <TableHead className="w-28">التاريخ</TableHead>
        <TableHead className="w-16">الرمز</TableHead>
      </TableRow>
    </TableHeader>
  );
};
