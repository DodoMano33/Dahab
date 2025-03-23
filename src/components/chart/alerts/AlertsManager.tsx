
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertsDialog } from './components/AlertsDialog';
import { useAlerts } from './hooks/useAlerts';

interface AlertsManagerProps {
  onCreateAlerts?: (analysisData: any) => void;
}

export const AlertsManager: React.FC<AlertsManagerProps> = ({ onCreateAlerts }) => {
  const {
    alerts,
    loading,
    alertsEnabled,
    fetchAlerts,
    addAlertFromAnalysis,
    handleDeleteAlert,
    toggleAlerts
  } = useAlerts();
  
  const [isOpen, setIsOpen] = useState(false);

  // गलब التنبیهات عند فتح المكون
  useEffect(() => {
    if (isOpen) {
      fetchAlerts();
    }
  }, [isOpen]);

  // Handle creating alerts from analysis if onCreateAlerts prop is passed
  const handleCreateAlerts = onCreateAlerts 
    ? (data: any) => {
        addAlertFromAnalysis(data);
        if (onCreateAlerts) onCreateAlerts(data);
      }
    : undefined;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                {alerts.length}
              </span>
            )}
          </Button>
        </DialogTrigger>
        
        <AlertsDialog
          alerts={alerts}
          loading={loading}
          alertsEnabled={alertsEnabled}
          onToggleAlerts={toggleAlerts}
          onDeleteAlert={handleDeleteAlert}
        />
      </Dialog>
    </>
  );
};

export default AlertsManager;
