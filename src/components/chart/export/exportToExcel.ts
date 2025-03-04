
import { SearchHistoryItem } from "@/types/analysis";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import * as XLSX from 'xlsx';

export const exportToExcel = async (items: SearchHistoryItem[]) => {
  // إنشاء مصفوفة البيانات
  const data = items.map(item => {
    // استخراج الأهداف كسلسلة نصية
    const targetsStr = item.analysis.targets
      ? item.analysis.targets.map(t => `${t.price} (${format(t.expectedTime, 'PPp', { locale: ar })})`).join(', ')
      : '';
      
    // استخراج معلومات أفضل نقطة دخول
    const bestEntry = item.analysis.bestEntryPoint 
      ? `${item.analysis.bestEntryPoint.price} - ${item.analysis.bestEntryPoint.reason}`
      : '';
    
    return {
      'الرمز': item.symbol,
      'نوع التحليل': item.analysisType,
      'الإطار الزمني': item.timeframe,
      'تاريخ التحليل': format(item.date, 'PPP', { locale: ar }),
      'السعر الحالي': item.currentPrice,
      'الاتجاه': item.analysis.direction,
      'النمط': item.analysis.pattern,
      'الدعم': item.analysis.support,
      'المقاومة': item.analysis.resistance,
      'وقف الخسارة': item.analysis.stopLoss,
      'أفضل نقطة دخول': bestEntry,
      'الأهداف': targetsStr,
      'تحقق أي هدف': item.targetHit ? 'نعم' : 'لا',
      'تفعل وقف الخسارة': item.stopLossHit ? 'نعم' : 'لا',
      'آخر سعر تم فحصه': item.last_checked_price || '-',
      'آخر وقت فحص': item.last_checked_at 
        ? format(new Date(item.last_checked_at), 'PPp', { locale: ar }) 
        : '-'
    };
  });
  
  // إنشاء ورقة عمل
  const worksheet = XLSX.utils.json_to_sheet(data, { 
    header: [
      'الرمز', 'نوع التحليل', 'الإطار الزمني', 'تاريخ التحليل', 
      'السعر الحالي', 'الاتجاه', 'النمط', 'الدعم', 'المقاومة',
      'وقف الخسارة', 'أفضل نقطة دخول', 'الأهداف', 'تحقق أي هدف',
      'تفعل وقف الخسارة', 'آخر سعر تم فحصه', 'آخر وقت فحص'
    ]
  });
  
  // ضبط عرض الأعمدة
  const columnWidths = [
    { wch: 10 },  // الرمز
    { wch: 15 },  // نوع التحليل
    { wch: 10 },  // الإطار الزمني
    { wch: 20 },  // تاريخ التحليل
    { wch: 12 },  // السعر الحالي
    { wch: 10 },  // الاتجاه
    { wch: 20 },  // النمط
    { wch: 10 },  // الدعم
    { wch: 10 },  // المقاومة
    { wch: 12 },  // وقف الخسارة
    { wch: 40 },  // أفضل نقطة دخول
    { wch: 50 },  // الأهداف
    { wch: 10 },  // تحقق أي هدف
    { wch: 15 },  // تفعل وقف الخسارة
    { wch: 15 },  // آخر سعر تم فحصه
    { wch: 20 },  // آخر وقت فحص
  ];
  worksheet['!cols'] = columnWidths;
  
  // إنشاء كتاب عمل وإضافة الورقة إليه
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'تحليلات');
  
  // تصدير الملف
  XLSX.writeFile(workbook, `تحليلات-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
};
