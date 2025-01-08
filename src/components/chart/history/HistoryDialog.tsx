import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SearchHistoryContent } from "./SearchHistoryContent";
import { SearchHistoryItem } from "@/types/analysis";
import { Rnd } from "react-rnd";
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  history: SearchHistoryItem[];
  onDelete: (id: string) => void;
}

export const HistoryDialog = ({ isOpen, onClose, history, onDelete }: HistoryDialogProps) => {
  const [size, setSize] = useState({ width: 1200, height: 800 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-0 bg-transparent border-0 shadow-none" style={{ maxWidth: "100vw", width: "100vw", height: "100vh" }}>
        <Rnd
          size={{ width: size.width, height: size.height }}
          position={{ x: position.x, y: position.y }}
          disableDragging={true}
          onResize={(e, direction, ref, delta, position) => {
            setSize({
              width: ref.offsetWidth,
              height: ref.offsetHeight,
            });
            setPosition(position);
          }}
          minWidth={400}
          minHeight={300}
          bounds="window"
          className="bg-background border rounded-lg shadow-lg"
        >
          <div className="p-6 h-full flex flex-col relative" dir="rtl">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">سجل البحث</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-hidden mt-4">
              <SearchHistoryContent history={history} onDelete={onDelete} />
            </div>
          </div>
        </Rnd>
      </DialogContent>
    </Dialog>
  );
};