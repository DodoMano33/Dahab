import { Share2, MessageCircle, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareButtonGroupProps {
  onShare: (platform: 'whatsapp' | 'facebook' | 'copy') => Promise<void>;
}

export const ShareButtonGroup = ({ onShare }: ShareButtonGroupProps) => {
  return (
    <>
      <Button onClick={() => onShare('whatsapp')} variant="outline" size="icon">
        <MessageCircle className="h-4 w-4" />
      </Button>
      <Button onClick={() => onShare('facebook')} variant="outline" size="icon">
        <Facebook className="h-4 w-4" />
      </Button>
      <Button onClick={() => onShare('copy')} variant="outline" size="icon">
        <Share2 className="h-4 w-4" />
      </Button>
    </>
  );
};