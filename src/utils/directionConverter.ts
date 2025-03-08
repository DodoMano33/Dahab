
/**
 * Converts Arabic direction terms to English for AnalysisData compatibility
 */
export const convertArabicDirectionToEnglish = (direction: string): "Up" | "Down" | "Neutral" => {
  if (direction === "صاعد") return "Up";
  if (direction === "هابط") return "Down";
  return "Neutral";
};

/**
 * Converts Arabic activation types to English
 */
export const convertActivationTypeToEnglish = (activationType: string): "Automatic" | "Manual" => {
  if (activationType === "يدوي") return "Manual";
  return "Automatic"; // Default to automatic
};
