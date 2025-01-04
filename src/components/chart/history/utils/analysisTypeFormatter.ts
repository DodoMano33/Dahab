type TypeMapping = {
  [key: string]: string;
};

const TYPE_MAPPINGS: TypeMapping = {
  'سكالبينج': 'Scalping',
  'موجات': 'Waves',
  'أنماط': 'Patterns',
  'ذكي': 'Smart',
  'Price Action': 'Price Action'
};

export const formatAnalysisType = (analysisType: string, pattern: string) => {
  if (analysisType === "ذكي") {
    const typesMatch = pattern.match(/\((.*?)\)/);
    if (!typesMatch) return "Smart";

    const types = typesMatch[1]
      .split(',')
      .map(type => {
        const trimmedType = type.trim();
        return TYPE_MAPPINGS[trimmedType] || trimmedType;
      })
      .join(' + ');

    return `Smart (${types})`;
  }
  return analysisType;
};