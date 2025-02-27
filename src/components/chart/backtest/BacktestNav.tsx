
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { BackTestResultsDialog } from "./BackTestResultsDialog";
import { BestEntryPointResultsDialog } from "./BestEntryPointResultsDialog";
import { History, Target } from "lucide-react";

export const BacktestNav = () => {
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [isEntryPointResultsOpen, setIsEntryPointResultsOpen] = useState(false);

  return (
    <>
      <div className="flex space-x-2 flex-row-reverse">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-primary hover:text-primary/80 flex items-center gap-1"
          onClick={() => setIsResultsOpen(true)}
        >
          <History className="h-4 w-4" />
          <span>نتائج الباك تست</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          className="text-primary hover:text-primary/80 flex items-center gap-1"
          onClick={() => setIsEntryPointResultsOpen(true)}
        >
          <Target className="h-4 w-4" />
          <span>أفضل نقاط الدخول</span>
        </Button>
      </div>

      <BackTestResultsDialog 
        isOpen={isResultsOpen} 
        onClose={() => setIsResultsOpen(false)} 
      />
      
      <BestEntryPointResultsDialog 
        isOpen={isEntryPointResultsOpen} 
        onClose={() => setIsEntryPointResultsOpen(false)} 
      />
    </>
  );
};
