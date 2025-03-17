
/**
 * Utility to extract price data from the TradingView chart
 */

// Function to extract price from chart
export const extractPriceFromChart = async (): Promise<number | null> => {
  try {
    console.log("Attempting to extract price from chart");
    
    // Mock price extraction - in a real scenario this would interact with the DOM
    // to get the price from the TradingView widget
    const chartContainer = document.getElementById('tv_chart_container');
    
    if (!chartContainer) {
      console.log("Chart container not found");
      return null;
    }
    
    // Simulate a price extraction by using any price-related element in the chart
    const priceElements = chartContainer.querySelectorAll('[data-name="price"]');
    if (priceElements && priceElements.length > 0) {
      const textContent = priceElements[0].textContent;
      if (textContent) {
        const extractedPrice = parseFloat(textContent.replace(/[^0-9.]/g, ''));
        console.log(`Extracted price: ${extractedPrice}`);
        return !isNaN(extractedPrice) ? extractedPrice : null;
      }
    }
    
    // Dispatch an event to request price from other components
    window.dispatchEvent(new Event('request-current-price'));
    
    // Default gold price if extraction fails (could be retrieved from API in production)
    const defaultPrice = 2450.75;
    console.log(`Using default price: ${defaultPrice}`);
    return defaultPrice;
  } catch (error) {
    console.error("Error extracting price from chart:", error);
    return null;
  }
};
