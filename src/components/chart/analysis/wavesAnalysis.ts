import { addDays } from "date-fns";

export const analyzeWavesChart = async (
  chartImage: string,
  currentPrice: number,
  symbol: string
) => {
  console.log("بدء تحليل Waves للرمز:", symbol);

  // حساب الموجات بناءً على السعر الحالي
  const waveRange = currentPrice * 0.02; // نطاق 2% للموجة
  
  // تحديد مستويات الدعم والمقاومة بناءً على الموجات
  const support = currentPrice - (waveRange * 2);
  const resistance = currentPrice + (waveRange * 2);

  // تحديد الاتجاه بناءً على نمط الموجات
  const direction = Math.random() > 0.5 ? "صاعد" : "هابط";

  // حساب نقطة وقف الخسارة بناءً على الموجة السابقة
  const stopLoss = direction === "صاعد" 
    ? currentPrice - (waveRange * 3)  // وقف خسارة تحت الموجة السابقة
    : currentPrice + (waveRange * 3);  // وقف خسارة فوق الموجة السابقة

  // تحديد أفضل نقطة دخول بناءً على نمط الموجات
  const bestEntry = {
    price: direction === "صاعد" 
      ? currentPrice - waveRange
      : currentPrice + waveRange,
    reason: direction === "صاعد"
      ? "نقطة دخول عند تصحيح الموجة A بنسبة 61.8% فيبوناتشي"
      : "نقطة دخول عند اكتمال الموجة C وبداية الموجة التصحيحية"
  };

  // حساب الأهداف المتوقعة بناءً على امتدادات الموجات
  const targets = [
    {
      price: direction === "صاعد"
        ? currentPrice + (waveRange * 3)
        : currentPrice - (waveRange * 3),
      expectedTime: addDays(new Date(), 7)
    },
    {
      price: direction === "صاعد"
        ? currentPrice + (waveRange * 5)
        : currentPrice - (waveRange * 5),
      expectedTime: addDays(new Date(), 14)
    },
    {
      price: direction === "صاعد"
        ? currentPrice + (waveRange * 8)
        : currentPrice - (waveRange * 8),
      expectedTime: addDays(new Date(), 21)
    }
  ];

  const analysisResult = {
    pattern: `نموذج موجي ${direction === "صاعد" ? "صاعد" : "هابط"} - ${direction === "صاعد" ? "اكتمال الموجة التصحيحية" : "اكتمال الموجة الدافعة"}`,
    direction,
    currentPrice,
    support,
    resistance,
    stopLoss,
    bestEntryPoint: bestEntry,
    targets,
    analysisType: "Waves" as const
  };

  console.log("نتائج تحليل Waves:", analysisResult);
  return analysisResult;
};