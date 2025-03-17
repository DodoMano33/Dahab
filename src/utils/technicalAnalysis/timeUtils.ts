
import { addDays, addHours, addMinutes, format, parseISO, isValid, differenceInMinutes } from "date-fns";
import { ar } from "date-fns/locale";

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

// دالة مساعدة لتنسيق التاريخ بالشكل المطلوب
export const formatDateArabic = (timestamp: string | Date | null): string => {
  if (!timestamp || timestamp === "---") return "-";
  
  try {
    let date: Date;
    
    // التعامل مع التنسيقات المختلفة للتاريخ
    if (typeof timestamp === 'string') {
      if (timestamp.includes('T')) {
        // تنسيق ISO
        date = parseISO(timestamp);
      } else {
        // تنسيق آخر للتاريخ
        date = new Date(timestamp);
      }
    } else {
      date = timestamp;
    }
    
    // التحقق من صحة التاريخ 
    if (!isValid(date)) {
      console.warn(`Invalid date format: ${timestamp}, type: ${typeof timestamp}`);
      return "-";
    }
    
    return format(date, 'dd/M/yyyy HH:mm', { locale: ar });
  } catch (error) {
    console.error("Error formatting date:", error, "Timestamp:", timestamp);
    return "-";
  }
};

// دالة لتحويل تاريخ إنشاء السجل إلى تنسيق مناسب
export const formatCreatedAtDate = (timestamp: string | Date | null): string => {
  if (!timestamp) return "-";
  
  try {
    let date: Date;
    
    if (typeof timestamp === 'string') {
      date = parseISO(timestamp);
    } else {
      date = timestamp;
    }
    
    if (!isValid(date)) {
      console.warn(`Invalid created_at date: ${timestamp}`);
      return "-";
    }
    
    // طباعة التاريخ للتشخيص
    console.log(`Formatting created_at date: ${timestamp} to Date object: ${date}`);
    
    return format(date, 'dd/M/yyyy HH:mm', { locale: ar });
  } catch (error) {
    console.error("Error formatting created_at date:", error);
    return "-";
  }
};

// دالة لتحويل تاريخ نتيجة التحليل إلى تنسيق مناسب
export const formatResultDate = (timestamp: string | Date | null): string => {
  if (!timestamp) return "لم يكتمل بعد";
  
  try {
    let date: Date;
    
    if (typeof timestamp === 'string') {
      date = parseISO(timestamp);
    } else {
      date = timestamp;
    }
    
    if (!isValid(date)) {
      console.warn(`Invalid result_timestamp date: ${timestamp}`);
      return "تاريخ غير صالح";
    }
    
    // طباعة التاريخ للتشخيص
    console.log(`Formatting result_timestamp date: ${timestamp} to Date object: ${date}`);
    
    return format(date, 'dd/M/yyyy HH:mm', { locale: ar });
  } catch (error) {
    console.error("Error formatting result_timestamp date:", error, "Timestamp:", timestamp);
    return "خطأ في التنسيق";
  }
};

// دالة لحساب الفرق بين تاريخين بتنسيق ساعات:دقائق
export const formatTimeDuration = (startDate: string | Date | null, endDate: string | Date | null): string => {
  if (!startDate || !endDate) return "-";
  
  try {
    // تحويل التواريخ إلى كائنات Date
    let start: Date;
    let end: Date;
    
    if (typeof startDate === 'string') {
      start = new Date(startDate);
    } else {
      start = startDate;
    }
    
    if (typeof endDate === 'string') {
      end = new Date(endDate);
    } else {
      end = endDate;
    }
    
    // التحقق من صحة التواريخ
    if (!isValid(start) || !isValid(end)) {
      console.warn(`Invalid date format: start=${startDate}, end=${endDate}`);
      return "-";
    }
    
    // التحقق من أن التواريخ مختلفة
    if (start.getTime() === end.getTime()) {
      console.warn(`Warning: Start and end dates are identical: ${start}`);
      return "-";
    }
    
    // حساب الفرق بالدقائق
    const diffInMinutes = differenceInMinutes(end, start);
    
    if (diffInMinutes < 0) {
      console.warn(`Warning: Negative time difference (${diffInMinutes} minutes) between ${start} and ${end}`);
      return "-";
    }
    
    // تحويل إلى ساعات ودقائق
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    
    // طباعة الحساب للتشخيص
    console.log(`Time duration: ${start} to ${end} = ${hours}h:${minutes}m (${diffInMinutes} minutes)`);
    
    // تنسيق النتيجة بالشكل HH:MM
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  } catch (error) {
    console.error("Error calculating time duration:", error);
    return "-";
  }
};
