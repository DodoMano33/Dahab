import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface HistoryTableHeaderProps {
  showCheckbox?: boolean;
  showDelete?: boolean;
}

export const HistoryTableHeader = ({ showCheckbox = false, showDelete = false }: HistoryTableHeaderProps) => (
  <TableHeader className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-20">
    <TableRow>
      {showCheckbox && <TableHead className="w-12 text-center">تحديد</TableHead>}
      <TableHead className="text-right font-bold">التاريخ</TableHead>
      <TableHead className="text-right font-bold">الرمز</TableHead>
      <TableHead className="text-right font-bold">نوع التحليل</TableHead>
      <TableHead className="text-right font-bold">الإطار الزمني</TableHead>
      <TableHead className="text-right font-bold">السعر عند التحليل</TableHead>
      <TableHead className="text-right font-bold">الاتجاه</TableHead>
      <TableHead className="text-right font-bold">أفضل نقطة دخول</TableHead>
      <TableHead className="text-right font-bold">الأهداف والتوقيت</TableHead>
      <TableHead className="text-right font-bold">وقف الخسارة</TableHead>
      {showDelete && <TableHead className="w-12 text-center">حذف</TableHead>}
    </TableRow>
  </TableHeader>
);