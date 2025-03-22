
import { Button } from "@/components/ui/button";
import { SearchHistoryItem } from "@/types/analysis";
import { Share } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { generateShareText } from "./ShareText";

// Update interface to match the property name being used
interface ShareButtonGroupProps {
  items: SearchHistoryItem[];
}

export const ShareButtonGroup = ({ items }: ShareButtonGroupProps) => {
  if (!items || items.length === 0) {
    return null;
  }

  const handleCopyToClipboard = async () => {
    try {
      const shareText = items.map(item => generateShareText(item)).join('\n\n---\n\n');
      await navigator.clipboard.writeText(shareText);
      toast.success("تم نسخ المحتوى إلى الحافظة");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error("حدث خطأ أثناء نسخ المحتوى");
    }
  };

  const handleShareViaWhatsApp = () => {
    try {
      const shareText = items.map(item => generateShareText(item)).join('\n\n---\n\n');
      const encodedText = encodeURIComponent(shareText);
      window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    } catch (error) {
      console.error("Error sharing via WhatsApp:", error);
      toast.error("حدث خطأ أثناء المشاركة عبر واتساب");
    }
  };

  const handleShareViaTelegram = () => {
    try {
      const shareText = items.map(item => generateShareText(item)).join('\n\n---\n\n');
      const encodedText = encodeURIComponent(shareText);
      window.open(`https://t.me/share/url?url=&text=${encodedText}`, '_blank');
    } catch (error) {
      console.error("Error sharing via Telegram:", error);
      toast.error("حدث خطأ أثناء المشاركة عبر تلغرام");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Share className="h-4 w-4 mr-2" />
          مشاركة
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleCopyToClipboard}>نسخ</DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareViaWhatsApp}>واتساب</DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareViaTelegram}>تلغرام</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
