
import React, { useEffect, useState } from 'react';

interface TradingViewScriptProps {
  onScriptLoaded: () => void;
}

export const TradingViewScript: React.FC<TradingViewScriptProps> = ({ 
  onScriptLoaded 
}) => {
  useEffect(() => {
    console.log('Loading TradingView script');
    
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      console.log('TradingView script loaded');
      onScriptLoaded();
    };
    document.head.appendChild(script);
    
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [onScriptLoaded]);

  return null; // مكون لا يرجع أي UI
};
