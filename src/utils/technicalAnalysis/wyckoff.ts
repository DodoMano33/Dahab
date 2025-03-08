
/**
 * Gets a Wyckoff analysis based on trend direction
 * @param direction The trend direction
 * @returns Wyckoff analysis with phase and description
 */
export const getWyckoffAnalysis = (direction: string) => {
  const phases = [
    { phase: 'Accumulation', description: 'Smart money is accumulating positions' },
    { phase: 'Markup', description: 'Price is rising steadily' },
    { phase: 'Distribution', description: 'Smart money is selling to the public' },
    { phase: 'Markdown', description: 'Price is falling steadily' }
  ];
  
  // Determine phase based on direction
  if (direction === 'Up') {
    return Math.random() > 0.5 ? phases[0] : phases[1]; // Accumulation or Markup
  } else {
    return Math.random() > 0.5 ? phases[2] : phases[3]; // Distribution or Markdown
  }
};
