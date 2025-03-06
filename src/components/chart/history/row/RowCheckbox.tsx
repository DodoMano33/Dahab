
import { TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface RowCheckboxProps {
  isSelected?: boolean;
  onSelect?: () => void;
}

export const RowCheckbox = ({ isSelected, onSelect }: RowCheckboxProps) => {
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
