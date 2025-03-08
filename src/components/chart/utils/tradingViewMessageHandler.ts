
import { cleanSymbolName, isValidPrice, extractPriceFromMessage, extractSymbolFromMessage } from '@/utils/tradingViewUtils';

type MessageHandler = (event: MessageEvent) => void;

interface MessageHandlerOptions {
  onSymbolChange?: (symbol: string) => void;
  onPriceUpdate?: (price: number) => void;
  lastSymbolRef: React.MutableRefObject<string>;
  lastPriceRef: React.MutableRefObject<number | null>;
}

/**
 * Creates a handler function for processing TradingView widget messages
 */
export const createMessageHandler = ({
  onSymbolChange,
  onPriceUpdate,
  lastSymbolRef,
  lastPriceRef
}: MessageHandlerOptions): MessageHandler => {
  return (event: MessageEvent) => {
    try {
      // Only process messages with data
      if (!event.data) return;
      
      // Debug log to see all incoming messages
      console.log("TradingView raw message received:", event.data);
      
      // Extract symbol and price from different message formats
      const newSymbol = extractSymbolFromMessage(event.data);
      const newPrice = extractPriceFromMessage(event.data);
      
      // Process symbol change if detected
      if (newSymbol && newSymbol !== lastSymbolRef.current) {
        const cleanedSymbol = cleanSymbolName(newSymbol);
        console.log('Symbol changed to:', cleanedSymbol, '(from:', newSymbol, ')');
        lastSymbolRef.current = newSymbol;
        
        if (onSymbolChange) {
          onSymbolChange(cleanedSymbol);
        }
      }
      
      // Process price update if detected
      if (newPrice !== null && isValidPrice(newPrice) && newPrice !== lastPriceRef.current) {
        console.log('Price updated to:', newPrice);
        lastPriceRef.current = newPrice;
        
        if (onPriceUpdate) {
          onPriceUpdate(newPrice);
        }
      }
    } catch (error) {
      console.error('Error handling TradingView message:', error);
    }
  };
};

/**
 * Attempts to extract price from DOM elements in the TradingView chart
 */
export const extractPriceFromDOM = (
  container: HTMLDivElement,
  lastPriceRef: React.MutableRefObject<number | null>,
  onPriceUpdate?: (price: number) => void
): void => {
  try {
    // Try to find price elements in the widget
    const priceElements = container.querySelectorAll('.tv-symbol-price-quote__value');
    if (priceElements.length > 0) {
      const priceText = priceElements[0].textContent;
      if (priceText) {
        const price = parseFloat(priceText.replace(/,/g, ''));
        if (!isNaN(price) && isValidPrice(price) && price !== lastPriceRef.current) {
          console.log('Price extracted from DOM:', price);
          lastPriceRef.current = price;
          
          if (onPriceUpdate) {
            onPriceUpdate(price);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error extracting price from DOM:', error);
  }
};
