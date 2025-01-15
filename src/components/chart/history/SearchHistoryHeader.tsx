import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SearchHistoryHeaderProps {
  totalCount?: number;
}

export const SearchHistoryHeader = ({ totalCount = 0 }: SearchHistoryHeaderProps) => {
  return (
    <DialogHeader className="p-6 pb-0">
      <DialogTitle className="text-2xl font-bold flex items-center gap-2">
        سجل البحث
        <span className="text-sm font-normal text-muted-foreground">
          ({totalCount} تحليل)
        </span>
      </DialogTitle>
    </DialogHeader>
  );
};