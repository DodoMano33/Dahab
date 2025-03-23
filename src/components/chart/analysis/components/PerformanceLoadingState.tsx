
import React from 'react';
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const PerformanceLoadingState: React.FC = () => {
  return (
    <>
      <CardHeader>
        <CardTitle>مؤشرات الأداء</CardTitle>
        <CardDescription>جاري تحميل البيانات...</CardDescription>
      </CardHeader>
      <CardContent className="min-h-80 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">جاري تحليل البيانات...</div>
      </CardContent>
    </>
  );
};
