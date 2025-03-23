
import React from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AlertsToggle } from './AlertsToggle';
import { AlertsList } from './AlertsList';
import { Alert } from '../hooks/useAlerts';

interface AlertsDialogProps {
  alerts: Alert[];
  loading: boolean;
  alertsEnabled: boolean;
  onToggleAlerts: (enabled: boolean) => void;
  onDeleteAlert: (alertId: string) => void;
}

export const AlertsDialog: React.FC<AlertsDialogProps> = ({
  alerts,
  loading,
  alertsEnabled,
  onToggleAlerts,
  onDeleteAlert
}) => {
  return (
    <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>إدارة التنبيهات</DialogTitle>
        <DialogDescription>
          تنبيهات لنقاط الدخول والخروج ووقف الخسارة
        </DialogDescription>
      </DialogHeader>
      
      <AlertsToggle enabled={alertsEnabled} onToggle={onToggleAlerts} />
      
      <AlertsList 
        alerts={alerts} 
        loading={loading} 
        onDelete={onDeleteAlert} 
      />
    </DialogContent>
  );
};
