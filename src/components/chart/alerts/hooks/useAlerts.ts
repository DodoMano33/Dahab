
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { createAlert, getActiveAlerts, deleteAlert } from '../alertsService';

export interface Alert {
  id: string;
  symbol: string;
  price: number;
  type: 'entry' | 'exit' | 'stop_loss' | 'target';
  direction: 'above' | 'below';
  created_at: string;
  is_triggered: boolean;
  user_id: string;
  timeframe: string;
  analysis_id?: string;
}

export const useAlerts = () => {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(
    localStorage.getItem('alertsEnabled') === 'true'
  );

  // جلب التنبيهات النشطة
  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const activeAlerts = await getActiveAlerts();
      setAlerts(activeAlerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: "خطأ في جلب التنبيهات",
        description: "تعذر جلب التنبيهات النشطة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // إضافة التنبيه من تحليل
  const addAlertFromAnalysis = async (analysisData: any) => {
    try {
      if (!analysisData || !analysisData.bestEntryPoint) return;

      // إنشاء تنبيه لنقطة الدخول
      if (analysisData.bestEntryPoint.price) {
        const entryType = analysisData.direction === 'صاعد' ? 'below' : 'above';
        await createAlert({
          symbol: analysisData.symbol || 'XAUUSD',
          price: analysisData.bestEntryPoint.price,
          type: 'entry',
          direction: entryType,
          timeframe: analysisData.timeframe || '1h',
          analysis_id: analysisData.id
        });
      }

      // إنشاء تنبيه لوقف الخسارة
      if (analysisData.stopLoss) {
        const slType = analysisData.direction === 'صاعد' ? 'below' : 'above';
        await createAlert({
          symbol: analysisData.symbol || 'XAUUSD',
          price: analysisData.stopLoss,
          type: 'stop_loss',
          direction: slType,
          timeframe: analysisData.timeframe || '1h',
          analysis_id: analysisData.id
        });
      }

      // إنشاء تنبيهات للأهداف
      if (analysisData.targets && analysisData.targets.length > 0) {
        const targetType = analysisData.direction === 'صاعد' ? 'above' : 'below';
        for (const target of analysisData.targets) {
          await createAlert({
            symbol: analysisData.symbol || 'XAUUSD',
            price: target.price,
            type: 'target',
            direction: targetType,
            timeframe: analysisData.timeframe || '1h',
            analysis_id: analysisData.id
          });
        }
      }

      toast({
        title: "تم إنشاء التنبيهات بنجاح",
        description: "تم إنشاء تنبيهات للدخول والخروج ووقف الخسارة",
      });
      
      fetchAlerts();
    } catch (error) {
      console.error('Error creating alerts:', error);
      toast({
        title: "خطأ في إنشاء التنبيهات",
        description: "تعذر إنشاء التنبيهات. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  // حذف تنبيه
  const handleDeleteAlert = async (alertId: string) => {
    try {
      await deleteAlert(alertId);
      setAlerts(alerts.filter(alert => alert.id !== alertId));
      toast({
        title: "تم حذف التنبيه",
        description: "تم حذف التنبيه بنجاح",
      });
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast({
        title: "خطأ في حذف التنبيه",
        description: "تعذر حذف التنبيه. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  // تبديل حالة التنبيهات
  const toggleAlerts = (enabled: boolean) => {
    setAlertsEnabled(enabled);
    localStorage.setItem('alertsEnabled', enabled.toString());
    
    toast({
      title: enabled ? "تم تفعيل التنبيهات" : "تم إيقاف التنبيهات",
      description: enabled 
        ? "ستتلقى إشعارات عندما يصل السعر إلى المستويات المحددة" 
        : "لن تتلقى إشعارات حتى يتم إعادة تفعيل التنبيهات",
    });
  };

  return {
    alerts,
    loading,
    alertsEnabled,
    fetchAlerts,
    addAlertFromAnalysis,
    handleDeleteAlert,
    toggleAlerts
  };
};
