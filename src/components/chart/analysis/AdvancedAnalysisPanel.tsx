
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Bell, 
  BarChart3, 
  ChartLine, 
  BrainCircuit
} from 'lucide-react';
import { AlertsTabContent } from './components/AlertsTabContent';
import { PerformanceTabContent } from './components/PerformanceTabContent';
import { MetricsTabContent } from './components/MetricsTabContent';

interface AdvancedAnalysisPanelProps {
  currentAnalysisType: string;
  onCreateAlerts?: (analysisData: any) => void;
}

export function AdvancedAnalysisPanel({ 
  currentAnalysisType,
  onCreateAlerts 
}: AdvancedAnalysisPanelProps) {
  const [activeTab, setActiveTab] = useState('alerts');

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BrainCircuit className="mr-2 h-5 w-5" />
          لوحة التحليل المتقدم
        </CardTitle>
        <CardDescription>
          أدوات متقدمة لتتبع أداء التحليلات وإنشاء التنبيهات
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="alerts" className="flex items-center">
              <Bell className="mr-2 h-4 w-4" />
              التنبيهات
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              أداء المحللين
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center">
              <ChartLine className="mr-2 h-4 w-4" />
              مؤشرات التحليل
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="alerts">
            <AlertsTabContent 
              currentAnalysisType={currentAnalysisType} 
              onCreateAlerts={onCreateAlerts} 
            />
          </TabsContent>
          
          <TabsContent value="performance">
            <PerformanceTabContent />
          </TabsContent>
          
          <TabsContent value="metrics">
            <MetricsTabContent analysisType={currentAnalysisType} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default AdvancedAnalysisPanel;
