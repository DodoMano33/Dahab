
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface HistoryTableHeaderProps {
  showCheckbox?: boolean;
}

export const HistoryTableHeader = ({
  showCheckbox
}: HistoryTableHeaderProps) => {
  return (
    <TableHeader className="sticky top-0 bg-background z-30 border-b shadow-sm">
      <TableRow>
        {showCheckbox && <TableHead className="w-10"></TableHead>}
        <TableHead className="w-16 text-right">حالة السوق</TableHead>
        <TableHead className="w-24 text-right">آخر فحص</TableHead>
        <TableHead className="w-20 text-right">الوقت المتبقي</TableHead>
        <TableHead className="w-24 text-right">أفضل نقطة دخول</TableHead>
        <TableHead className="w-24 text-right">الأهداف</TableHead>
        <TableHead className="w-20 text-right">وقف الخسارة</TableHead>
        <TableHead className="w-16 text-right">الاتجاه</TableHead>
        <TableHead className="w-16 text-right">سعر الدخول</TableHead>
        <TableHead className="w-28 text-right">نوع التحليل</TableHead>
        <TableHead className="w-20 text-right">الإطار الزمني</TableHead>
        <TableHead className="w-28 text-right">التاريخ</TableHead>
        <TableHead className="w-16 text-right">الرمز</TableHead>
      </TableRow>
    </TableHeader>
  );
};
