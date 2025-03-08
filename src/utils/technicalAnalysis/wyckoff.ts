
// Simple utility to get Wyckoff analysis phases
export const getWyckoffAnalysis = (direction: string) => {
  const phases = [
    "Accumulation",
    "Markup",
    "Distribution",
    "Markdown"
  ];
  
  // Return a simple object with phase info based on direction
  return {
    phase: direction === "Up" 
      ? (Math.random() > 0.5 ? phases[0] : phases[1])
      : (Math.random() > 0.5 ? phases[2] : phases[3]),
    description: `Wyckoff ${direction === "Up" ? "bullish" : "bearish"} phase detected`
  };
};
