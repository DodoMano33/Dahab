
import { Card } from "@/components/ui/card";

export const EconomicCalendar = () => {
  return (
    <Card className="p-4 mt-4">
      <h3 className="text-lg font-semibold mb-4">مواعيد الأخبار الاقتصادية</h3>
      <div className="w-full aspect-[16/9]">
        <iframe
          src="https://widgets.myfxbook.com/widgets/calendar.html?lang=ar"
          className="w-full h-full border-0"
          title="Economic Calendar"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          loading="lazy"
        />
      </div>
    </Card>
  );
};
