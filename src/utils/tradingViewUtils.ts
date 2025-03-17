
/**
 * Utilities for interacting with TradingView chart
 */
import html2canvas from 'html2canvas';

// Function to get chart image
export const getTradingViewChartImage = async (
  symbol: string,
  timeframe: string,
  price: number
): Promise<string> => {
  try {
    console.log(`Getting chart image for ${symbol} on ${timeframe} timeframe at price ${price}`);
    
    // Find the chart container
    const chartContainer = document.getElementById('tv_chart_container');
    if (!chartContainer) {
      console.error('TradingView chart container not found');
      return '';
    }
    
    // Use html2canvas to capture the chart as an image
    const canvas = await html2canvas(chartContainer, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#131722', // TradingView dark theme background
    });
    
    // Convert canvas to image data URL
    const imageData = canvas.toDataURL('image/png');
    console.log('Chart image captured successfully');
    
    return imageData;
  } catch (error) {
    console.error('Error capturing TradingView chart image:', error);
    return '';
  }
};

// Function to set symbol on TradingView chart
export const setTradingViewSymbol = (symbol: string): void => {
  // This would interact with TradingView's API in a real implementation
  console.log(`Setting TradingView symbol to ${symbol}`);
  
  // Attempt to find and use TradingView's widget API
  try {
    const tvWidget = (window as any).tvWidget;
    if (tvWidget && tvWidget.chart) {
      tvWidget.chart().setSymbol(symbol);
    }
  } catch (error) {
    console.error('Error setting TradingView symbol:', error);
  }
};

// Function to set timeframe on TradingView chart
export const setTradingViewTimeframe = (timeframe: string): void => {
  console.log(`Setting TradingView timeframe to ${timeframe}`);
  
  // Attempt to find and use TradingView's widget API
  try {
    const tvWidget = (window as any).tvWidget;
    if (tvWidget && tvWidget.chart) {
      tvWidget.chart().setResolution(timeframe);
    }
  } catch (error) {
    console.error('Error setting TradingView timeframe:', error);
  }
};
