
import { useEffect, useRef } from "react";
import { createTradingViewWidget } from "@/utils/tradingview/chartSetup";

const TradingViewWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const { widgetContainer } = createTradingViewWidget(containerRef.current);

      return () => {
        // Clean up
        if (widgetContainer) {
          widgetContainer.innerHTML = '';
        }
      };
    }
  }, []);

  return (
    <div ref={containerRef} style={{ height: "500px", width: "100%" }}>
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse">جاري تحميل الشارت...</div>
      </div>
    </div>
  );
};

export default TradingViewWidget;
