import { Button } from "@/components/ui/button";
import { Share2, MessageCircle, Facebook, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SearchHistoryItem } from "@/types/analysis";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface ShareButtonsProps {
  selectedItems: Set<string>;
  dateRange: { from: Date | undefined; to: Date | undefined };
  history: SearchHistoryItem[];
}

export const ShareButtons = ({ selectedItems, dateRange, history }: ShareButtonsProps) => {
  const handleShare = async (platform: 'whatsapp' | 'facebook' | 'copy') => {
    try {
      let shareText = "";
      
      const filteredHistory = history.filter(item => {
        if (selectedItems.size > 0) {
          return selectedItems.has(item.id);
        }
        if (dateRange.from && dateRange.to) {
          return item.date >= dateRange.from && item.date <= dateRange.to;
        }
        return false;
      });

      if (filteredHistory.length === 0) {
        toast.error("الرجاء تحديد عناصر للمشاركة");
        return;
      }

      shareText = filteredHistory.map(item => `
تاريخ التحليل: ${format(item.date, 'PPpp', { locale: ar })}
الرمز: ${item.symbol}
نوع التحليل: ${item.analysisType}
السعر عند التحليل: ${item.currentPrice}
${'-'.repeat(50)}`
      ).join('\n');

      switch (platform) {
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`, '_blank');
          break;
        case 'copy':
          await navigator.clipboard.writeText(shareText);
          toast.success("تم نسخ المحتوى إلى الحافظة");
          break;
      }
    } catch (error) {
      console.error("خطأ في المشاركة:", error);
      toast.error("حدث خطأ أثناء المشاركة");
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={() => handleShare('whatsapp')} variant="outline" size="icon">
        <MessageCircle className="h-4 w-4" />
      </Button>
      <Button onClick={() => handleShare('facebook')} variant="outline" size="icon">
        <Facebook className="h-4 w-4" />
      </Button>
      <Button onClick={() => handleShare('copy')} variant="outline" size="icon">
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
};