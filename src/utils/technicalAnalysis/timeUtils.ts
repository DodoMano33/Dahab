import { addDays, addHours, addMinutes } from "date-fns";

export const getExpectedTime = (timeframe: string, targetIndex: number) => {
  const now = new Date();
  
  switch (timeframe) {
    case "1m":
      return addMinutes(now, (targetIndex + 1) * 1);
    case "5m":
      return addMinutes(now, (targetIndex + 1) * 5);
    case "30m":
      return addMinutes(now, (targetIndex + 1) * 30);
    case "1h":
      return addHours(now, targetIndex + 1);
    case "4h":
      return addHours(now, (targetIndex + 1) * 4);
    case "1d":
      return addDays(now, targetIndex + 1);
    default:
      return addHours(now, (targetIndex + 1) * 4);
  }
};

export const getTimeframeLabel = (timeframe: string): string => {
  switch (timeframe) {
    case "1m":
      return "دقيقة واحدة";
    case "5m":
      return "5 دقائق";
    case "30m":
      return "30 دقيقة";
    case "1h":
      return "ساعة واحدة";
    case "4h":
      return "4 ساعات";
    case "1d":
      return "يومي";
    default:
      return timeframe;
  }
};