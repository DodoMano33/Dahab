interface BestEntryPointProps {
  price?: number;
  reason?: string;
}

export const BestEntryPoint = ({ price, reason }: BestEntryPointProps) => {
  if (!price) return <div>غير متوفر</div>;
  
  return (
    <div>
      <div>السعر: {price}</div>
      <div className="text-sm text-gray-600">
        السبب: {reason}
      </div>
    </div>
  );
};