
// نقل دالة getStrategyName لتكون قبل استخدامها
export const getStrategyName = (type: string): string => {
  const strategyMap: Record<string, string> = {
    normal: "التحليل العادي",
    fibonacci: "فيبوناتشي",
    fibonacci_advanced: "فيبوناتشي المتقدم",
    gann: "تحليل جان",
    waves: "تحليل الموجات",
    price_action: "حركة السعر",
    scalping: "سكالبينج",
    smc: "تحليل تحكم السيولة",
    ict: "تحليل ICT",
    time_clustering: "تحليل تجمع الوقت",
    pattern: "تحليل الأنماط",
    multi_variance: "التباين المتعدد",
    neural_network: "الشبكة العصبية",
    behaviors: "تحليل السلوك",
    turtle_soup: "تحليل Turtle Soup",
    rnn: "شبكة RNN العصبية",
    composite_candlesticks: "تحليل الشموع المركب"
  };

  // إذا وجد النوع، نرجع اسمه، وإلا نرجع النوع كما هو
  return strategyMap[type] || type;
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
