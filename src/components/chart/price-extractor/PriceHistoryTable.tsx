
import React from 'react';

interface PriceRecord {
  price: number;
  timestamp: Date;
  source: string;
}

interface PriceHistoryTableProps {
  priceHistory: PriceRecord[];
}

export const PriceHistoryTable: React.FC<PriceHistoryTableProps> = ({ priceHistory }) => {
  return (
    <div className="max-h-60 overflow-y-auto border rounded-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">الوقت</th>
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">السعر</th>
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">المصدر</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {priceHistory.map((record, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-700 text-right">
                {record.timestamp.toLocaleTimeString('ar-SA')}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-right">
                {record.price.toFixed(3)}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 text-right truncate max-w-[150px]">
                {record.source}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
