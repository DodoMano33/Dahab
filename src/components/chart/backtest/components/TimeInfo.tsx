
type TimeInfoProps = {
  formattedTime: string;
  nextAutoCheck: string;
  hasNetworkError: boolean;
};

export const TimeInfo = ({ formattedTime, nextAutoCheck, hasNetworkError }: TimeInfoProps) => {
  return (
    <>
      {formattedTime && (
        <p className="text-xs text-muted-foreground mt-1">
          آخر فحص: {formattedTime}
        </p>
      )}
      {nextAutoCheck && !hasNetworkError && (
        <p className="text-xs text-muted-foreground mt-1">
          الفحص التلقائي التالي بعد: {nextAutoCheck}
        </p>
      )}
    </>
  );
};
