import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface HistoryTableHeaderProps {
  showCheckbox?: boolean;
  showDelete?: boolean;
}

export const HistoryTableHeader = ({ showCheckbox = false, showDelete = false }: HistoryTableHeaderProps) => (
  <TableHeader>
    <TableRow>
      {showCheckbox && <TableHead className="w-12"></TableHead>}
      <TableHead className="text-right">التاريخ</TableHead>
      <TableHead className="text-right">الرمز</TableHead>
      <TableHead className="text-right">نوع التحليل</TableHead>
      <TableHead className="text-right">السعر عند التحليل</TableHead>
      <TableHead className="text-right">الاتجاه</TableHead>
      <TableHead className="text-right">أفضل نقطة دخول</TableHead>
      <TableHead className="text-right">الأهداف والتوقيت</TableHead>
      <TableHead className="text-right">وقف الخسارة</TableHead>
      {showDelete && <TableHead className="w-12"></TableHead>}
    </TableRow>
  </TableHeader>
);