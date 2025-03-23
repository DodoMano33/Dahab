
import React from 'react';
import { AlertCard } from '../AlertCard';
import { Alert } from '../hooks/useAlerts';

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
  if (loading) {
    return <div className="text-center py-10">جاري تحميل التنبيهات...</div>;
  }
  
  if (alerts.length === 0) {
    return <div className="text-center py-10">لا توجد تنبيهات نشطة</div>;
  }

  return (
    <div className="space-y-4">
      {alerts.map(alert => (
        <AlertCard 
          key={alert.id} 
          alert={alert} 
          onDelete={() => onDelete(alert.id)} 
        />
      ))}
    </div>
  );
};
