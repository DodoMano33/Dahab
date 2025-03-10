
import { TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxCellProps {
  isSelected?: boolean;
  onSelect?: () => void;
}

export const CheckboxCell = ({ isSelected, onSelect }: CheckboxCellProps) => {
  if (!onSelect) return null;
  
  return (
    <TableCell className="w-10 p-2">
      <Checkbox 
        checked={isSelected} 
        onCheckedChange={onSelect}
        className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
      />
    </TableCell>
  );
};
