
import { Button } from "@/components/ui/button";
import { FileDown, FileText, Table as TableIcon } from "lucide-react";
import { SearchHistoryItem } from "@/types/analysis";
import { exportToPDF } from "../export/exportToPDF";
import { exportToExcel } from "../export/exportToExcel";
import { generateShareText } from "./ShareText";
import { toast } from "sonner";

interface ExportAnalysisProps {
  selectedItems: SearchHistoryItem[];
}

export const ExportAnalysis = ({ selectedItems }: ExportAnalysisProps) => {
  if (selectedItems.length === 0) {
    return null;
  }
  
  const handleExportToPDF = async () => {
    try {
      await exportToPDF(selectedItems);
      toast.success('تم تصدير التحليلات إلى PDF بنجاح');
    } catch (error) {
      console.error('خطأ أثناء تصدير PDF:', error);
      toast.error('حدث خطأ أثناء تصدير التحليلات إلى PDF');
    }
  };
  
  const handleExportToExcel = async () => {
    try {
      await exportToExcel(selectedItems);
      toast.success('تم تصدير التحليلات إلى Excel بنجاح');
    } catch (error) {
      console.error('خطأ أثناء تصدير Excel:', error);
      toast.error('حدث خطأ أثناء تصدير التحليلات إلى Excel');
    }
  };
  
  const handleCopyAsText = async () => {
    try {
      const text = selectedItems.map(item => generateShareText(item)).join('\n\n---\n\n');
      await navigator.clipboard.writeText(text);
      toast.success('تم نسخ التحليلات كنص بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء نسخ التحليلات');
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportToPDF}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        <span>PDF</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportToExcel}
        className="flex items-center gap-2"
      >
        <TableIcon className="h-4 w-4" />
        <span>Excel</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyAsText}
        className="flex items-center gap-2"
      >
        <FileDown className="h-4 w-4" />
        <span>نص</span>
      </Button>
    </div>
  );
};
