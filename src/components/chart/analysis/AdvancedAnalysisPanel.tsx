
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
import { AlertsManager } from '../alerts/AlertsManager';
import { AnalystPerformance } from './AnalystPerformance';
import { PerformanceMetrics } from './PerformanceMetrics';
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  BarChart3, 
  ChartLine, 
  BarChart4,
  BrainCircuit
} from 'lucide-react';

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
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                إنشاء وإدارة التنبيهات لنقاط الدخول والخروج ووقف الخسارة والأهداف.
              </p>
              
              <AlertsManager />
              
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
          </TabsContent>
          
          <TabsContent value="performance">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                تتبع ومقارنة أداء مختلف أنواع التحليل بناءً على النتائج السابقة.
              </p>
              
              <AnalystPerformance />
            </div>
          </TabsContent>
          
          <TabsContent value="metrics">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                مؤشرات تفصيلية حول أداء نوع التحليل الحالي.
              </p>
              
              <PerformanceMetrics analysisType={currentAnalysisType} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default AdvancedAnalysisPanel;
