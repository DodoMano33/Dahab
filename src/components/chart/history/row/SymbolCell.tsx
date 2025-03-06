
import { TableCell } from "@/components/ui/table";

interface SymbolCellProps {
  symbol: string;
}

export const SymbolCell = ({ symbol }: SymbolCellProps) => {
  return (
    <TableCell className="font-medium w-16 p-2">{symbol}</TableCell>
  );
};
