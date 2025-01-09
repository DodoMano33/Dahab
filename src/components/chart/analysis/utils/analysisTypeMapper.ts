export const mapAnalysisType = (type: string) => {
  const mapping: { [key: string]: string } = {
    'scalping': 'سكالبينج',
    'smc': 'SMC',
    'ict': 'ICT',
    'turtleSoup': 'Turtle Soup',
    'gann': 'Gann',
    'waves': 'Waves',
    'patterns': 'Patterns',
    'priceAction': 'Price Action'
  };
  
  const mappedType = mapping[type];
  if (!mappedType) {
    console.warn(`نوع تحليل غير معروف: ${type}`);
    return 'Patterns'; // نوع افتراضي
  }
  
  return mappedType;
};