
import React from 'react';
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const PerformanceEmptyState: React.FC = () => {
  return (
    <>
      <CardHeader>
        <CardTitle>مؤشرات الأداء</CardTitle>
        <CardDescription>لا توجد بيانات كافية</CardDescription>
      </CardHeader>
      <CardContent className="min-h-80 flex items-center justify-center">
        <div className="text-muted-foreground">لا توجد بيانات كافية لعرض مؤشرات الأداء</div>
      </CardContent>
    </>
  );
};
