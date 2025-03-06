
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface HistoryTableHeaderProps {
  showCheckbox?: boolean;
}

export const HistoryTableHeader = ({
  showCheckbox
}: HistoryTableHeaderProps) => {
  return (
    <TableHeader className="sticky top-0 bg-background z-10 border-b">
      <TableRow>
        {showCheckbox && <TableHead className="w-10"></TableHead>}
        <TableHead className="w-16">الرمز</TableHead>
        <TableHead className="w-28">التاريخ</TableHead>
        <TableHead className="w-20">الإطار الزمني</TableHead>
        <TableHead className="w-28">نوع التحليل</TableHead>
        <TableHead className="w-16">سعر الدخول</TableHead>
        <TableHead className="w-16">الاتجاه</TableHead>
        <TableHead className="w-20">وقف الخسارة</TableHead>
        <TableHead className="w-24">الأهداف</TableHead>
        <TableHead className="w-24">أفضل نقطة دخول</TableHead>
        <TableHead className="w-20">الوقت المتبقي</TableHead>
        <TableHead className="w-24">آخر فحص</TableHead>
        <TableHead className="w-16">حالة السوق</TableHead>
      </TableRow>
    </TableHeader>
  );
};
