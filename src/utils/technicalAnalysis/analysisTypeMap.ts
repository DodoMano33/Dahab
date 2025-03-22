
// نقل دالة getStrategyName لتكون قبل استخدامها
export const getStrategyName = (type: string): string => {
  // توحيد الأنواع المختلفة لنفس التحليل
  const normalizedType = type.toLowerCase().replace(/_/g, '').trim();
  
  // استخدام تخطيط موحد للأنواع
  if (normalizedType.includes('normal') || normalizedType.includes('عادي')) {
    return "التحليل العادي";
  }
  if (normalizedType.includes('scalping') || normalizedType.includes('سكالبينج') || normalizedType.includes('مضاربة')) {
    return "مضاربة (Scalping)";
  }
  if (normalizedType.includes('ict') || normalizedType.includes('نظريةالسوق')) {
    return "ICT - نظرية السوق";
  }
  if (normalizedType.includes('smc') || normalizedType.includes('هيكلالسوق')) {
    return "SMC - نظرية هيكل السوق";
  }
  if (normalizedType.includes('turtle') || normalizedType.includes('turtlesoup') || normalizedType.includes('الحساءالسلحفائي')) {
    return "Turtle Soup تحليل";
  }
  if (normalizedType.includes('gann') || normalizedType.includes('جان')) {
    return "تحليل جان (Gann)";
  }
  if (normalizedType.includes('waves') || normalizedType.includes('تقلبات')) {
    return "تحليل الموجات";
  }
  if (normalizedType.includes('pattern') || normalizedType.includes('نمطي')) {
    return "تحليل الأنماط";
  }
  if (normalizedType.includes('priceaction') || normalizedType.includes('حركةالسعر')) {
    return "حركة السعر";
  }
  if (normalizedType.includes('fibonacciadvanced') || normalizedType.includes('فيبوناتشيمتقدم')) {
    return "تحليل فيبوناتشي متقدم";
  }
  if (normalizedType.includes('fibonacci') || normalizedType.includes('فيبوناتشي')) {
    return "فيبوناتشي";
  }
  if (normalizedType.includes('neuralnetwork') || normalizedType.includes('شبكاتعصبية')) {
    return "شبكات عصبية";
  }
  if (normalizedType.includes('rnn') || normalizedType.includes('شبكاتعصبيةمتكررة')) {
    return "شبكة RNN العصبية";
  }
  if (normalizedType.includes('timecluster') || normalizedType.includes('تصفيقزمني')) {
    return "تحليل تجمع الوقت";
  }
  if (normalizedType.includes('multivariance') || normalizedType.includes('تباينمتعدد')) {
    return "تباين متعدد العوامل";
  }
  if (normalizedType.includes('composite') || normalizedType.includes('شمعاتمركبة')) {
    return "تحليل الشموع المركب";
  }
  if (normalizedType.includes('behavioral') || normalizedType.includes('سلوكي')) {
    return "تحليل السلوك";
  }
  
  // إذا لم يتطابق مع أي من الأنواع المعروفة، نعرض النوع كما هو
  console.log(`نوع غير معروف: ${type}`);
  return type;
};

// قائمة أنواع التحليل الرئيسية - فقط 16 نوع كما في المتطلبات
export const mainAnalysisTypes = [
  "normal", // التحليل العادي
  "scalping", // مضاربة
  "ict", // نظرية السوق
  "smc", // نظرية هيكل السوق
  "turtle_soup", // الحساء السلحفائي
  "gann", // جان
  "waves", // تقلبات (الموجات)
  "pattern", // نمطي (الأنماط)
  "price_action", // حركة السعر
  "fibonacci", // فيبوناتشي
  "fibonacci_advanced", // تحليل فيبوناتشي متقدم
  "neural_network", // شبكات عصبية
  "rnn", // شبكات عصبية متكررة
  "time_clustering", // تصفيق زمني
  "multi_variance", // تباين متعدد العوامل
  "composite_candlestick" // شمعات مركبة
];

// قائمة أنواع التحليل مع أسماء العرض
export const analysisTypesWithDisplayNames = mainAnalysisTypes.map(type => ({
  value: type,
  label: getStrategyName(type)
}));

// الأنواع المتاحة للتحليل السريع
export const quickAnalysisTypes = [
  { value: "normal", label: "التحليل العادي" },
  { value: "price_action", label: "حركة السعر" },
  { value: "pattern", label: "تحليل الأنماط" },
  { value: "fibonacci", label: "فيبوناتشي" },
  { value: "scalping", label: "مضاربة (Scalping)" },
  { value: "smc", label: "SMC - نظرية هيكل السوق" }
];

// مجموعات التحليل
export const analysisGroups = [
  {
    title: "التحليلات الأساسية",
    types: ["normal", "pattern", "price_action"]
  },
  {
    title: "تحليلات متخصصة",
    types: ["scalping", "ict", "smc", "gann"]
  },
  {
    title: "تحليلات فيبوناتشي والموجات",
    types: ["fibonacci", "fibonacci_advanced", "waves", "turtle_soup"]
  },
  {
    title: "تحليلات متقدمة",
    types: ["neural_network", "rnn", "time_clustering", "multi_variance", "composite_candlestick"]
  }
];

// دالة للحصول على مجموعة التحليل التي ينتمي إليها نوع معين
export const getAnalysisGroup = (type: string): string => {
  const normalizedType = type.toLowerCase().replace(/_/g, '').trim();
  
  for (const group of analysisGroups) {
    for (const groupType of group.types) {
      const normalizedGroupType = groupType.toLowerCase().replace(/_/g, '').trim();
      if (normalizedType.includes(normalizedGroupType)) {
        return group.title;
      }
    }
  }
  return "أخرى";
};
