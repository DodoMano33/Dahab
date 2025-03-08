
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import { getStrategyName } from "@/utils/technicalAnalysis/analysisTypeMap";

interface LatestAnalysesProps {
  userId: string;
}

export function LatestAnalyses({ userId }: LatestAnalysesProps) {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestAnalyses = async () => {
      try {
        const { data, error } = await supabase
          .from('search_history')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setAnalyses(data || []);
      } catch (error) {
        console.error('Error fetching analyses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestAnalyses();
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 mr-4">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>آخر التحليلات</CardTitle>
        <CardDescription>
          أحدث التحليلات التي قمت بها
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analyses.length === 0 ? (
            <p className="text-center text-muted-foreground">لا توجد تحليلات حديثة</p>
          ) : (
            analyses.map((analysis) => (
              <div key={analysis.id} className="border rounded-lg p-3">
                <div className="flex justify-between">
                  <h4 className="font-medium">{analysis.symbol}</h4>
                  <span className="text-sm text-muted-foreground">
                    {new Date(analysis.created_at).toLocaleDateString('ar-SA')}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm">
                    {analysis.analysis?.pattern || getStrategyName(analysis.analysis_type)} - {analysis.timeframe}
                  </span>
                  <div className="flex items-center">
                    <span className={`text-sm ${analysis.target_hit ? 'text-green-500' : ''}`}>
                      {analysis.analysis?.direction}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
