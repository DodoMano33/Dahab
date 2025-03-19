
import { TableCell } from "@/components/ui/table";
import { useEffect, useState } from "react";

interface CurrentPriceCellProps {
  price: number;
}

export const CurrentPriceCell = ({ price }: CurrentPriceCellProps) => {
  const [currentPrice, setCurrentPrice] = useState<number>(price);

  // الاستماع لتحديثات سعر Alpha Vantage
  useEffect(() => {
    const handlePriceUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        setCurrentPrice(event.detail.price);
      }
    };

    window.addEventListener('alpha-vantage-price-update', handlePriceUpdate as EventListener);
    
    return () => {
      window.removeEventListener('alpha-vantage-price-update', handlePriceUpdate as EventListener);
    };
  }, []);

  // تحديث السعر عند تغير الـ prop
  useEffect(() => {
    setCurrentPrice(price);
  }, [price]);

  return (
    <TableCell className="w-16 p-2 text-center font-medium">
      {currentPrice.toFixed(2)}
    </TableCell>
  );
};
