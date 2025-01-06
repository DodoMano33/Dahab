export const AnalysisLegend = () => {
  return (
    <div className="bg-[#F4A460] p-4 rounded-lg">
      <h3 className="text-xl font-bold text-center text-white mb-4">
        إختيار التحليلات
      </h3>
      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="text-center text-gray-600">
          تظهر هنا نتائج التحليلات
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <p>في حال وصل السعر الحالي للعنصر الذي تم تحليله الى الهدف الاول يصبح لون الشريط اخضر فاتح</p>
          <p>في حال وصل السعر الحالي للعنصر الذي تم تحليله الى الهدف الثاني يصبح لون الشريط اخضر غامق</p>
          <p>في حال وصل السعر الحالي للعنصر الذي تم تحليله الى نقطة وقف الخسارة يصبح لون الشريط احمر غامق</p>
        </div>
      </div>
    </div>
  );
};