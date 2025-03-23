
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Bell, ArrowUp, ArrowDown, Target, DollarSign, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Alert {
  id: string;
  symbol: string;
  price: number;
  type: 'entry' | 'exit' | 'stop_loss' | 'target';
  direction: 'above' | 'below';
  created_at: string;
  is_triggered: boolean;
  timeframe: string;
  analysis_id?: string;
}

interface AlertCardProps {
  alert: Alert;
  onDelete: () => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onDelete }) => {
  // تحديد لون البطاقة بناءً على نوع التنبيه
  const getBadgeVariant = () => {
    switch (alert.type) {
      case 'entry':
        return 'outline';
      case 'exit':
        return 'secondary';
      case 'stop_loss':
        return 'destructive';
      case 'target':
        return 'default';
      default:
        return 'outline';
    }
  };

  // تحديد عنوان التنبيه بناءً على نوعه
  const getAlertTitle = () => {
    switch (alert.type) {
      case 'entry':
        return 'نقطة دخول';
      case 'exit':
        return 'نقطة خروج';
      case 'stop_loss':
        return 'وقف خسارة';
      case 'target':
        return 'هدف سعري';
      default:
        return 'تنبيه';
    }
  };

  // تحديد أيقونة التنبيه بناءً على نوعه
  const getAlertIcon = () => {
    switch (alert.type) {
      case 'entry':
        return <DollarSign className="h-4 w-4 mr-1" />;
      case 'exit':
        return <ArrowUp className="h-4 w-4 mr-1" />;
      case 'stop_loss':
        return <AlertTriangle className="h-4 w-4 mr-1" />;
      case 'target':
        return <Target className="h-4 w-4 mr-1" />;
      default:
        return <Bell className="h-4 w-4 mr-1" />;
    }
  };

  // تنسيق وقت إنشاء التنبيه
  const formatCreationTime = () => {
    try {
      return formatDistanceToNow(new Date(alert.created_at), {
        addSuffix: true,
        locale: ar
      });
    } catch (error) {
      return 'زمن غير معروف';
    }
  };

  return (
    <Card className={`border-l-4 ${alert.is_triggered ? 'border-l-green-500 bg-green-50' : `border-l-${alert.type === 'stop_loss' ? 'red' : alert.type === 'target' ? 'blue' : 'yellow'}-500`}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center mb-2">
              <Badge variant={getBadgeVariant()} className="flex items-center mr-2">
                {getAlertIcon()}
                {getAlertTitle()}
              </Badge>
              <span className="text-sm text-gray-500">{alert.timeframe}</span>
            </div>
            
            <div className="font-bold text-lg">{alert.symbol}</div>
            
            <div className="flex items-center mt-1">
              <span className="font-medium">
                {alert.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="mx-2 text-gray-500">
                {alert.direction === 'above' ? 'فوق السعر' : 'تحت السعر'}
              </span>
              {alert.direction === 'above' ? (
                <ArrowUp className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            
            <div className="text-xs text-gray-500 mt-2">
              تم الإنشاء {formatCreationTime()}
            </div>
          </div>
          
          {alert.is_triggered && (
            <Badge variant="success" className="ml-2">تم التفعيل</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-2 flex justify-end bg-gray-50">
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </CardFooter>
    </Card>
  );
};
