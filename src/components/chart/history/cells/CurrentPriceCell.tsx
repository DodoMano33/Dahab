
interface CurrentPriceCellProps {
  price: number;
}

export const CurrentPriceCell = ({ price }: CurrentPriceCellProps) => (
  <div>
    {price ? price.toFixed(2) : "-"}
  </div>
);
