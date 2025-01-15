import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface SearchHistoryHeaderProps {
  totalCount?: number;
}

export const SearchHistoryHeader = ({ totalCount = 0 }: SearchHistoryHeaderProps) => {
  return (
    <DialogHeader className="p-6 pb-0">
      <DialogTitle className="text-2xl font-bold flex items-center gap-2">
        سجل البحث
        <Badge variant="secondary" className="text-base">
          {totalCount} تحليل
        </Badge>
      </DialogTitle>
    </DialogHeader>
  );
};