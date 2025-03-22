
interface SymbolCellProps {
  symbol: string;
}

export const SymbolCell = ({ symbol }: SymbolCellProps) => (
  <div className="font-medium">
    {symbol}
  </div>
);
