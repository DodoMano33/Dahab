
import { SearchHistoryItem } from "@/types/analysis";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

// إضافة دعم TypeScript لـ jsPDF
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportToPDF = async (items: SearchHistoryItem[]) => {
  // إنشاء مستند PDF جديد
  const doc = new jsPDF();
  
  // تهيئة المستند للغة العربية
  doc.setR2L(true);
  
  // إضافة عنوان
  doc.setFontSize(18);
  doc.text('تقرير التحليلات الفنية', doc.internal.pageSize.width / 2, 20, { align: 'center' });
  
  // إضافة التاريخ
  doc.setFontSize(12);
  doc.text(
    `تاريخ التقرير: ${format(new Date(), 'PPP', { locale: ar })}`,
    doc.internal.pageSize.width / 2, 
    30, 
    { align: 'center' }
  );
  
  // إنشاء جدول بيانات التحليلات
  const tableData = items.map(item => [
    item.symbol,
    item.analysisType,
    item.timeframe,
    item.currentPrice.toString(),
    item.analysis.direction,
    item.analysis.stopLoss.toString(),
    item.analysis.targets ? item.analysis.targets.map(t => t.price).join(', ') : '-',
    format(item.date, 'PPP', { locale: ar })
  ]);
  
  // إنشاء جدول التحليلات
  doc.autoTable({
    head: [['الرمز', 'نوع التحليل', 'الإطار الزمني', 'السعر الحالي', 'الاتجاه', 'وقف الخسارة', 'الأهداف', 'التاريخ']],
    body: tableData,
    startY: 40,
    headStyles: { fillColor: [66, 66, 66] },
    styles: { 
      halign: 'right',
      font: 'courier',
      textColor: [0, 0, 0] 
    },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  });
  
  // لكل تحليل، أضف صفحة تفصيلية
  items.forEach((item, index) => {
    if (index > 0) {
      doc.addPage();
    } else {
      doc.addPage();
    }
    
    // عنوان التحليل
    doc.setFontSize(16);
    doc.text(`تحليل ${item.symbol} - ${item.analysisType}`, doc.internal.pageSize.width / 2, 20, { align: 'center' });
    
    // معلومات التحليل
    doc.setFontSize(12);
    let y = 40;
    const lineHeight = 10;
    
    doc.text(`الرمز: ${item.symbol}`, 20, y); y += lineHeight;
    doc.text(`نوع التحليل: ${item.analysisType}`, 20, y); y += lineHeight;
    doc.text(`الإطار الزمني: ${item.timeframe}`, 20, y); y += lineHeight;
    doc.text(`تاريخ التحليل: ${format(item.date, 'PPP', { locale: ar })}`, 20, y); y += lineHeight;
    doc.text(`السعر الحالي: ${item.currentPrice}`, 20, y); y += lineHeight;
    doc.text(`الاتجاه: ${item.analysis.direction}`, 20, y); y += lineHeight;
    doc.text(`النمط: ${item.analysis.pattern}`, 20, y); y += lineHeight;
    doc.text(`وقف الخسارة: ${item.analysis.stopLoss}`, 20, y); y += lineHeight;
    doc.text(`مستوى الدعم: ${item.analysis.support}`, 20, y); y += lineHeight;
    doc.text(`مستوى المقاومة: ${item.analysis.resistance}`, 20, y); y += lineHeight;
    
    // أفضل نقطة دخول
    if (item.analysis.bestEntryPoint) {
      doc.text(`أفضل نقطة دخول: ${item.analysis.bestEntryPoint.price}`, 20, y); y += lineHeight;
      
      // تقسيم السبب إلى أسطر متعددة إذا كان طويلاً
      const reason = item.analysis.bestEntryPoint.reason;
      const reasonLines = doc.splitTextToSize(reason, 170);
      doc.text(`السبب: `, 20, y);
      reasonLines.forEach(line => {
        doc.text(line, 40, y);
        y += 7;
      });
      y += 3;
    }
    
    // الأهداف
    if (item.analysis.targets && item.analysis.targets.length > 0) {
      doc.text('الأهداف:', 20, y); y += lineHeight;
      
      item.analysis.targets.forEach((target, idx) => {
        doc.text(
          `الهدف ${idx + 1}: ${target.price} (${format(target.expectedTime, 'PPp', { locale: ar })})`, 
          30, 
          y
        );
        y += lineHeight;
      });
    }
  });
  
  // حفظ المستند
  doc.save(`تحليلات-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};
