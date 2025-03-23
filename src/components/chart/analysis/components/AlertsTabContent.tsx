
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bell } from 'lucide-react';
import { AlertsManager } from '../../alerts/AlertsManager';

interface AlertsTabContentProps {
  currentAnalysisType: string;
  onCreateAlerts?: (analysisData: any) => void;
}

export const AlertsTabContent: React.FC<AlertsTabContentProps> = ({ 
  currentAnalysisType, 
  onCreateAlerts 
}) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        إنشاء وإدارة التنبيهات لنقاط الدخول والخروج ووقف الخسارة والأهداف.
      </p>
      
      <AlertsManager onCreateAlerts={onCreateAlerts} />
      
      {onCreateAlerts && (
        <div className="flex justify-end">
          <Button 
            onClick={() => onCreateAlerts({ type: currentAnalysisType })}
            variant="outline"
            className="mt-2"
          >
            <Bell className="mr-2 h-4 w-4" />
            إنشاء تنبيهات من التحليل الحالي
          </Button>
        </div>
      )}
    </div>
  );
};
