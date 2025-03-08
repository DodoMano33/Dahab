
// Get strategy name function - moved to be before its usage
export const getStrategyName = (type: string): string => {
  const strategyMap: Record<string, string> = {
    normal: "Normal Analysis",
    fibonacci: "Fibonacci",
    fibonacci_advanced: "Advanced Fibonacci",
    gann: "Gann Analysis",
    waves: "Waves Analysis",
    price_action: "Price Action",
    scalping: "Scalping",
    smc: "Smart Money Concept",
    ict: "ICT Analysis",
    time_clustering: "Time Clustering",
    pattern: "Pattern Analysis",
    multi_variance: "Multi Variance",
    neural_network: "Neural Network",
    behaviors: "Behavioral Analysis",
    turtle_soup: "Turtle Soup",
    rnn: "RNN Neural Network",
    composite_candlesticks: "Composite Candlestick"
  };

  // Return the name if found, otherwise return the type as-is
  return strategyMap[type] || type;
};

// Main analysis types list - removed unwanted types
export const mainAnalysisTypes = [
  "normal",
  "fibonacci",
  "fibonacci_advanced",
  "gann",
  "waves",
  "price_action",
  "scalping",
  "smc",
  "ict",
  "time_clustering",
  "pattern",
  "multi_variance",
  "neural_network",
  "behaviors",
  "turtle_soup",
  "rnn",
  "composite_candlesticks"
];

// Analysis types with display names
export const analysisTypesWithDisplayNames = mainAnalysisTypes.map(type => ({
  value: type,
  label: getStrategyName(type)
}));

// Quick analysis types
export const quickAnalysisTypes = [
  { value: "normal", label: "Normal Analysis" },
  { value: "fibonacci", label: "Fibonacci" },
  { value: "price_action", label: "Price Action" },
  { value: "pattern", label: "Pattern Analysis" }
];

// Analysis groups
export const analysisGroups = [
  {
    title: "Basic Analysis",
    types: ["normal"]
  },
  {
    title: "Candlestick and Pattern Analysis",
    types: ["pattern", "composite_candlesticks"]
  },
  {
    title: "Fibonacci and Gann Analysis",
    types: ["fibonacci", "fibonacci_advanced", "gann"]
  },
  {
    title: "Wave and Price Analysis",
    types: ["waves", "price_action", "smc", "ict"]
  },
  {
    title: "Advanced Analysis",
    types: [
      "scalping", 
      "time_clustering", 
      "multi_variance", 
      "neural_network", 
      "behaviors",
      "turtle_soup",
      "rnn"
    ]
  }
];

// Function to get the analysis group a type belongs to
export const getAnalysisGroup = (type: string): string => {
  for (const group of analysisGroups) {
    if (group.types.includes(type)) {
      return group.title;
    }
  }
  return "Other";
};
