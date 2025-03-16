
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const TableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="text-center w-[80px]">الرمز</TableHead>
        <TableHead className="text-center w-[80px]">الربح/الخسارة</TableHead>
        <TableHead className="text-center w-[80px]">الاتجاه</TableHead>
        <TableHead className="text-center w-[80px]">سعر الدخول</TableHead>
        <TableHead className="text-center w-[80px]">سعر الخروج</TableHead>
        <TableHead className="text-center w-[80px]">الهدف</TableHead>
        <TableHead className="text-center w-[80px]">وقف الخسارة</TableHead>
        <TableHead className="text-center w-[80px]">النتيجة</TableHead>
        <TableHead className="text-center w-[80px]">الإطار الزمني</TableHead>
        <TableHead className="text-center w-[100px]">نوع التحليل</TableHead>
        <TableHead className="text-center w-[150px]">تاريخ التحليل</TableHead>
        <TableHead className="text-center w-[150px]">تاريخ النتيجة</TableHead>
      </TableRow>
    </TableHeader>
  );
};
