
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface HistoryTableHeaderProps {
  showCheckbox?: boolean;
}

export const HistoryTableHeader = ({
  showCheckbox
}: HistoryTableHeaderProps) => {
  return (
    <TableHeader className="sticky top-0 bg-background z-10">
      <TableRow>
        {showCheckbox && <TableHead className="w-12"></TableHead>}
        <TableHead>الرمز</TableHead>
        <TableHead>التاريخ</TableHead>
        <TableHead>الإطار الزمني</TableHead>
        <TableHead>نوع التحليل</TableHead>
        <TableHead className="">سعر الدخول</TableHead>
        <TableHead>الاتجاه</TableHead>
        <TableHead>وقف الخسارة</TableHead>
        <TableHead>الأهداف</TableHead>
        <TableHead>أفضل نقطة دخول</TableHead>
        <TableHead>الوقت المتبقي</TableHead>
      </TableRow>
    </TableHeader>
  );
};
