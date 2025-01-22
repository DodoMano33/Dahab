import { useEffect, useState } from 'react';
import { differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface ExpiryTimerProps {
  createdAt: Date;
}

export const ExpiryTimer = ({ createdAt }: ExpiryTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const expiryDate = new Date(createdAt);
      expiryDate.setHours(expiryDate.getHours() + 8);

      if (now >= expiryDate) {
        setIsExpired(true);
        setTimeLeft("منتهي");
        return;
      }

      const hoursLeft = differenceInHours(expiryDate, now);
      const minutesLeft = differenceInMinutes(expiryDate, now) % 60;
      const secondsLeft = differenceInSeconds(expiryDate, now) % 60;

      setTimeLeft(`${String(hoursLeft).padStart(2, '0')}:${String(minutesLeft).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [createdAt]);

  return (
    <Badge variant={isExpired ? "destructive" : "secondary"}>
      {timeLeft}
    </Badge>
  );
};