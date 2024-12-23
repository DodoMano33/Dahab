import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const HistoryTableHeader = () => (
  <TableHeader>
    <TableRow>
      <TableHead className="text-right">التاريخ</TableHead>
      <TableHead className="text-right">الرمز</TableHead>
      <TableHead className="text-right">السعر الحالي</TableHead>
      <TableHead className="text-right">الاتجاه</TableHead>
      <TableHead className="text-right">أفضل نقطة دخول</TableHead>
      <TableHead className="text-right">الأهداف والتوقيت</TableHead>
      <TableHead className="text-right">وقف الخسارة</TableHead>
    </TableRow>
  </TableHeader>
);