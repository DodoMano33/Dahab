interface AnalysisTypeCellProps {
  analysisType: string;
  pattern?: string;
}

export const AnalysisTypeCell = ({ analysisType, pattern }: AnalysisTypeCellProps) => {
  const formatAnalysisType = () => {
    // Added console.log for debugging
    console.log('analysisType:', analysisType, 'pattern:', pattern);
    
    if (analysisType.trim() === 'ذكي' && pattern) {
      const typesMatch = pattern.match(/\((.*?)\)/);
      if (typesMatch && typesMatch[1]) {
        const types = typesMatch[1]
          .split(',')
          .map(type => type.trim())
          .join(' + ');
        return `Smart (${types})`;
      }
      return "Smart";
    }
    return analysisType;
  };

  return (
    <td className="text-right">
      {formatAnalysisType()}
    </td>
  );
};
