
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface HistoryTableHeaderProps {
  showCheckbox?: boolean;
  onSelectAll?: (checked: boolean) => void;
  allSelected?: boolean;
}

export const HistoryTableHeader = ({
  showCheckbox,
  onSelectAll,
  allSelected = false
}: HistoryTableHeaderProps) => {
  return (
    <TableHeader className="sticky top-0 bg-background z-30 border-b shadow-sm">
      <TableRow>
        {showCheckbox && (
          <TableHead className="w-10">
            {onSelectAll && (
              <Checkbox 
                checked={allSelected}
                onCheckedChange={(checked) => onSelectAll(!!checked)}
                className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
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
