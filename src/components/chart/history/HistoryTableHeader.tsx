import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface HistoryTableHeaderProps {
  showCheckbox?: boolean;
  showDelete?: boolean;
}

export const HistoryTableHeader = ({ showCheckbox = false, showDelete = false }: HistoryTableHeaderProps) => (
  <TableHeader className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-20">
    <TableRow>
      {showCheckbox && <TableHead className="w-[60px] text-center">تحديد</TableHead>}
      <TableHead className="w-[120px] text-center font-bold">التاريخ</TableHead>
      <TableHead className="w-[100px] text-center font-bold">الرمز</TableHead>
      <TableHead className="w-[140px] text-center font-bold">نوع التحليل</TableHead>
      <TableHead className="w-[100px] text-center font-bold">الإطار الزمني</TableHead>
      <TableHead className="w-[120px] text-center font-bold">السعر عند التحليل</TableHead>
      <TableHead className="w-[80px] text-center font-bold">الاتجاه</TableHead>
      <TableHead className="w-[160px] text-center font-bold">أفضل نقطة دخول</TableHead>
      <TableHead className="w-[140px] text-center font-bold">الأهداف والتوقيت</TableHead>
      <TableHead className="w-[120px] text-center font-bold">وقف الخسارة</TableHead>
      {showDelete && <TableHead className="w-[60px] text-center">حذف</TableHead>}
    </TableRow>
  </TableHeader>
);