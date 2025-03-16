
import { useEffect } from "react";
import { TableHeader } from "./table/TableHeader";
import { AnalysisRow } from "./table/AnalysisRow";
import { CurrentPriceListener } from "./table/CurrentPriceListener";
import { EmptyState } from "./table/EmptyState";

interface AnalysisTableProps {
  analyses: any[];
  selectedItems: Set<string>;
  onSelectAll: (checked: boolean) => void;
  onSelect: (id: string) => void;
  totalProfitLoss?: number;
  isLoading?: boolean;
}

export const AnalysisTable = ({
  analyses,
  selectedItems,
  onSelectAll,
  onSelect,
  isLoading = false
}: AnalysisTableProps) => {
  // لوج بعض المعلومات للمساعدة في التصحيح
  useEffect(() => {
    console.log("Rendering analysis table with analyses:", analyses.length);
    if (analyses.length > 0) {
      console.log("Sample analysis types from items:", analyses.slice(0, 5).map(a => 
        `${a.id}: ${a.analysis_type} -> ${getStrategyName(a.analysis_type)}`
      ));
      console.log("Unique analysis types in table:", 
        [...new Set(analyses.map(a => a.analysis_type))]);
    }
  }, [analyses]);

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      <TableHeader 
        onSelectAll={onSelectAll} 
        allSelected={selectedItems.size === analyses.length} 
        itemsCount={analyses.length}
      />
      
      <div className="divide-y text-xs">
        {analyses.length === 0 ? (
          <EmptyState isLoading={isLoading} />
        ) : (
          <CurrentPriceListener>
            {(currentPrice) => (
              <>
                {analyses.map((analysis) => (
                  <AnalysisRow
                    key={analysis.id}
                    analysis={analysis}
                    selected={selectedItems.has(analysis.id)}
                    onSelect={onSelect}
                    currentPrice={currentPrice}
                  />
                ))}
              </>
            )}
          </CurrentPriceListener>
        )}
      </div>
    </div>
  );
};

// دالة للحصول على اسم الاستراتيجية
const getStrategyName = (analysisType: string) => {
  try {
    // استيراد قد يؤدي لمشاكل دائرية في بعض الأحيان، لذا نستخدم الوظيفة محلياً
    if (!analysisType) return "غير معروف";
    
    // استخدام حل بديل إذا كان هناك مشكلة في استيراد getStrategyName
    const strategyMap: Record<string, string> = {
      normal: "عادي",
      scalping: "سكالبينج",
      smart: "ذكي",
      smc: "هيكل السوق",
      ict: "نظرية السوق",
      "turtle-soup": "الحساء السلحفائي",
      gann: "جان",
      waves: "موجات",
      patterns: "أنماط",
      "price-action": "حركة السعر",
      "neural-network": "شبكات عصبية",
      rnn: "شبكات عصبية متكررة",
      "time-clustering": "تصفيق زمني",
      "multi-variance": "تباين متعدد العوامل",
      "composite-candlestick": "شمعات مركبة",
      behavioral: "سلوكي",
      fibonacci: "فيبوناتشي",
      "fibonacci-advanced": "فيبوناتشي متقدم",
    };
    
    return strategyMap[analysisType.toLowerCase()] || analysisType;
  } catch (e) {
    console.error("Error in getStrategyName:", e);
    return analysisType || "غير معروف";
  }
};
