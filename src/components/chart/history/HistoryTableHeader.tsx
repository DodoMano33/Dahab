import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface HistoryTableHeaderProps {
  showCheckbox?: boolean;
  showDelete?: boolean;
}

export const HistoryTableHeader = ({ showCheckbox = false, showDelete = false }: HistoryTableHeaderProps) => (
  <TableHeader className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-20">
    <TableRow>
      {showCheckbox && <TableHead className="w-[60px] text-right">تحديد</TableHead>}
      <TableHead className="w-[120px] text-right font-bold">التاريخ</TableHead>
      <TableHead className="w-[100px] text-right font-bold">الرمز</TableHead>
      <TableHead className="w-[140px] text-right font-bold">نوع التحليل</TableHead>
      <TableHead className="w-[100px] text-right font-bold">الإطار الزمني</TableHead>
      <TableHead className="w-[120px] text-right font-bold">السعر عند التحليل</TableHead>
      <TableHead className="w-[80px] text-right font-bold">الاتجاه</TableHead>
      <TableHead className="w-[160px] text-right font-bold">أفضل نقطة دخول</TableHead>
      <TableHead className="w-[160px] text-right font-bold">الأهداف والتوقيت</TableHead>
      <TableHead className="w-[120px] text-right font-bold">وقف الخسارة</TableHead>
      {showDelete && <TableHead className="w-[60px] text-left">حذف</TableHead>}
    </TableRow>
  </TableHeader>
);