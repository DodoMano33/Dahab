import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
interface HistoryTableHeaderProps {
  showCheckbox?: boolean;
}
export const HistoryTableHeader = ({
  showCheckbox
}: HistoryTableHeaderProps) => {
  return <TableHeader>
      <TableRow>
        {showCheckbox && <TableHead className="w-12"></TableHead>}
        <TableHead>الرمز</TableHead>
        <TableHead>التاريخ</TableHead>
        <TableHead>الإطار الزمني</TableHead>
        <TableHead>نوع التحليل</TableHead>
        <TableHead className="\u0633\u0639\u0631 \u0627\u0644\u062F\u062E\u0648\u0644">السعر الحالي</TableHead>
        <TableHead>الاتجاه</TableHead>
        <TableHead>وقف الخسارة</TableHead>
        <TableHead>الأهداف</TableHead>
        <TableHead>أفضل نقطة دخول</TableHead>
        <TableHead>الوقت المتبقي</TableHead>
      </TableRow>
    </TableHeader>;
};