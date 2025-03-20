
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PatternCardProps {
  pattern: string;
  direction: string;
}

export const PatternCard = ({ pattern, direction }: PatternCardProps) => {
  const getDirectionColor = (direction: string) => 
    direction === "صاعد" ? "text-green-600" : "text-red-600";

  return (
    <Card className="flex-1 glass-card">
      <CardHeader className="py-4">
        <CardTitle className="text-xl flex items-center justify-between">
          <span>النموذج المكتشف</span>
          <Badge variant="outline" className={cn(
            getDirectionColor(direction)
          )}>
            {direction}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-xl font-medium">{pattern}</p>
      </CardContent>
    </Card>
  );
};
