
interface EmptyStateProps {
  isLoading: boolean;
}

export const EmptyState = ({ isLoading }: EmptyStateProps) => {
  if (isLoading) {
    return (
      <div className="text-center p-4 bg-muted/30 rounded-lg">
        جاري تحميل التحليلات...
      </div>
    );
  }
  
  return (
    <div className="text-center p-4 bg-muted/30 rounded-lg">
      لا توجد تحليلات لعرضها
    </div>
  );
};
