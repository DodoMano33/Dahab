
import { useState } from "react";

export const useSymbolState = () => {
  const [currentSymbol, setCurrentSymbol] = useState<string>('');
  
  return {
    currentSymbol,
    setCurrentSymbol
  };
};
