import { SearchHistoryItem } from "@/types/analysis";

const MAX_HISTORY_ITEMS = 5; // Reduce from 10 to 5 to save space
const MAX_IMAGE_SIZE = 50000; // ~50KB limit for images

export const compressImage = (imageData: string): string => {
  // Basic compression by reducing base64 string if it's too large
  if (imageData.length > MAX_IMAGE_SIZE) {
    console.log("Compressing large image data");
    // Keep only first MAX_IMAGE_SIZE characters - this is a basic approach
    // In a production app, you'd want to use proper image compression
    return imageData.substring(0, MAX_IMAGE_SIZE);
  }
  return imageData;
};

export const saveAnalysisToHistory = (historyItem: SearchHistoryItem): SearchHistoryItem[] => {
  try {
    // Get existing history
    const existingHistory = localStorage.getItem('chartAnalysisHistory');
    const history: SearchHistoryItem[] = existingHistory ? 
      JSON.parse(existingHistory) : [];

    // Compress image before saving
    const compressedItem = {
      ...historyItem,
      image: compressImage(historyItem.image)
    };

    // Keep only last MAX_HISTORY_ITEMS items
    const newHistory = [compressedItem, ...history.slice(0, MAX_HISTORY_ITEMS - 1)];
    
    try {
      localStorage.setItem('chartAnalysisHistory', JSON.stringify(newHistory));
      console.log("Successfully saved to history");
      return newHistory;
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
      // If saving fails, try to save without images
      const historyWithoutImages = newHistory.map(item => ({
        ...item,
        image: '' // Remove images to save space
      }));
      localStorage.setItem('chartAnalysisHistory', JSON.stringify(historyWithoutImages));
      return historyWithoutImages;
    }
  } catch (e) {
    console.error("Error handling history:", e);
    return [];
  }
};

export const loadAnalysisHistory = (): SearchHistoryItem[] => {
  try {
    const history = localStorage.getItem('chartAnalysisHistory');
    return history ? JSON.parse(history) : [];
  } catch (e) {
    console.error("Error loading history:", e);
    return [];
  }
};
