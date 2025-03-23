
import React, { useState } from 'react';
import { AlertCard } from '../AlertCard';
import { Alert } from '../hooks/useAlerts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AlertsListProps {
  alerts: Alert[];
  loading: boolean;
  onDelete: (alertId: string) => void;
}

export const AlertsList: React.FC<AlertsListProps> = ({ 
  alerts, 
  loading, 
  onDelete 
}) => {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  
  if (loading) {
    return <div className="text-center py-10">جاري تحميل التنبيهات...</div>;
  }
  
  if (alerts.length === 0) {
    return <div className="text-center py-10">لا توجد تنبيهات نشطة</div>;
  }

  const filteredAlerts = typeFilter === "all" 
    ? alerts 
    : alerts.filter(alert => alert.type === typeFilter);

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="تصفية حسب النوع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع التنبيهات</SelectItem>
            <SelectItem value="entry">نقاط الدخول</SelectItem>
            <SelectItem value="exit">نقاط الخروج</SelectItem>
            <SelectItem value="stop_loss">وقف الخسارة</SelectItem>
            <SelectItem value="target">الأهداف</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAlerts.length > 0 ? (
        filteredAlerts.map(alert => (
          <AlertCard 
            key={alert.id} 
            alert={alert} 
            onDelete={() => onDelete(alert.id)} 
          />
        ))
      ) : (
        <div className="text-center py-6">لا توجد تنبيهات من هذا النوع</div>
      )}
    </div>
  );
};
