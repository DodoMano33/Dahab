
// نقل دالة getStrategyName لتكون قبل استخدامها
export const getStrategyName = (type: string): string => {
  if (!type) return "تحليل فني";
  
  // Normalize the type for comparison
  const normalizedType = type.toLowerCase().replace(/[_\s-]/g, '');
  
  const strategyMap: Record<string, string> = {
    // Arabic types
    "عادي": "تحليل عادي",
    "يومي": "تحليل فني",
    "نمطي": "تحليل الأنماط",
    "سكالبينج": "سكالبينج",
    "مضاربة": "مضاربة",
    "نظريةهيكلالسوق": "SMC",
    "نظريةالسوق": "ICT",
    "تقلبات": "تحليل الموجات",
    "حركةالسعر": "حركة السعر",
    "جان": "تحليل جان",
    "الحساءالسلحفائي": "Turtle Soup",
    "ذكي": "تحليل ذكي",
    "شبكاتعصبية": "شبكات عصبية",
    "شبكاتعصبيةمتكررة": "شبكات RNN",
    "تصفيقزمني": "تصفيق زمني",
    "تباينمتعددالعوامل": "تباين متعدد",
    "شمعاتمركبة": "شمعات مركبة",
    "تحليلسلوكي": "تحليل سلوكي",
    "فيبوناتشي": "فيبوناتشي",
    "فيبوناتشيمتقدم": "فيبوناتشي متقدم",
    
    // English types
    "normal": "تحليل عادي",
    "daily": "تحليل يومي",
    "pattern": "تحليل الأنماط",
    "scalping": "سكالبينج",
    "smc": "تحليل SMC",
    "ict": "تحليل ICT",
    "waves": "تحليل الموجات",
    "price_action": "حركة السعر",
    "gann": "تحليل جان",
    "turtle_soup": "Turtle Soup",
    "smart": "تحليل ذكي",
    "neural_network": "شبكات عصبية",
    "rnn": "شبكات RNN",
    "time_clustering": "تصفيق زمني",
    "multi_variance": "تباين متعدد",
    "composite_candlesticks": "شمعات مركبة",
    "behaviors": "تحليل سلوكي",
    "fibonacci": "فيبوناتشي",
    "fibonacci_advanced": "فيبوناتشي متقدم"
  };

  // Try to find an exact match
  if (strategyMap[type]) {
    return strategyMap[type];
  }
  
  // Try to find a normalized match
  for (const [key, value] of Object.entries(strategyMap)) {
    if (normalizedType.includes(key.toLowerCase())) {
      return value;
    }
  }

  // If no match found, return the original type
  return type;
};

// قائمة أنواع التحليل الرئيسية - تم حذف الأنواع غير المطلوبة
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

// قائمة أنواع التحليل مع أسماء العرض
export const analysisTypesWithDisplayNames = mainAnalysisTypes.map(type => ({
  value: type,
  label: getStrategyName(type)
}));

// الأنواع المتاحة للتحليل السريع
export const quickAnalysisTypes = [
  { value: "normal", label: "التحليل العادي" },
  { value: "fibonacci", label: "فيبوناتشي" },
  { value: "price_action", label: "حركة السعر" },
  { value: "pattern", label: "تحليل الأنماط" }
];

// مجموعات التحليل
export const analysisGroups = [
  {
    title: "التحليلات الأساسية",
    types: ["normal"]
  },
  {
    title: "تحليلات الشموع والأنماط",
    types: ["pattern", "composite_candlesticks"]
  },
  {
    title: "تحليلات فيبوناتشي وجان",
    types: ["fibonacci", "fibonacci_advanced", "gann"]
  },
  {
    title: "تحليلات الموجات والسعر",
    types: ["waves", "price_action", "smc", "ict"]
  },
  {
    title: "تحليلات متقدمة",
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

// دالة للحصول على مجموعة التحليل التي ينتمي إليها نوع معين
export const getAnalysisGroup = (type: string): string => {
  for (const group of analysisGroups) {
    if (group.types.includes(type)) {
      return group.title;
    }
  }
  return "أخرى";
};
