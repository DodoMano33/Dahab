
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface TradingNewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  published_at: string;
}

export const TradingNews = () => {
  const { data: news, isLoading } = useQuery({
    queryKey: ["trading-news"],
    queryFn: async () => {
      console.log("Fetching trading news...");
      const { data, error } = await supabase
        .from("trading_news")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching trading news:", error);
        throw error;
      }
      
      console.log("Fetched trading news:", data);
      return data as TradingNewsItem[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <Card className="p-4 mt-4">
        <div className="text-center text-muted-foreground">جاري تحميل الأخبار...</div>
      </Card>
    );
  }

  return (
    <Card className="p-4 mt-4">
      <h3 className="text-lg font-semibold mb-4">آخر أخبار التداول</h3>
      <ScrollArea className="h-[200px]">
        <div className="space-y-3">
          {news?.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  {item.source} • {new Date(item.published_at).toLocaleDateString("en")}
                </p>
              </div>
            </a>
          ))}
          {(!news || news.length === 0) && (
            <div className="text-center text-muted-foreground py-8">
              لا توجد أخبار متاحة حالياً
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
