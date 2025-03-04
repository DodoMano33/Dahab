
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

interface CalendarCardProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function CalendarCard({ date, setDate }: CalendarCardProps) {
  return (
    <Card className="w-full md:w-80">
      <CardHeader>
        <CardTitle>التقويم</CardTitle>
        <CardDescription>
          تتبع نشاطك اليومي
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </CardContent>
    </Card>
  );
}
