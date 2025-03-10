
import { TableCell } from "@/components/ui/table";
import { TargetsList } from "../TargetsList";

interface Target {
  price: number;
  expectedTime: Date;
}

interface TargetsListCellProps {
  targets: Target[];
  isTargetHit: boolean;
}

export const TargetsListCell = ({ targets, isTargetHit }: TargetsListCellProps) => (
  <TableCell className="w-24 p-2">
    <TargetsList 
      targets={targets} 
      isTargetHit={isTargetHit}
    />
  </TableCell>
);
