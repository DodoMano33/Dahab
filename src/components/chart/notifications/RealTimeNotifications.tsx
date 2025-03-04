
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  created_at: string;
  is_read: boolean;
}

export const RealTimeNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (error) throw error;
        
        setNotifications(data || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
    
    // إعداد الاستماع للتغييرات في الوقت الحقيقي
    const channel = supabase
      .channel('notifications_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: user ? `user_id=eq.${user.id}` : undefined
        },
        (payload) => {
          console.log("Real-time notification change:", payload);
          
          if (payload.eventType === 'INSERT') {
            setNotifications(prev => [payload.new as Notification, ...prev.slice(0, 9)]);
            
            // إظهار إشعار منبثق
            const notification = payload.new as Notification;
            const notificationMsg = new Notification("محلل الشارت الذكي", {
              body: notification.message,
              icon: "/favicon.ico"
            });
          }
        }
      )
      .subscribe();
      
    // طلب إذن الإشعارات
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  
  const markAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
        
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_read: true } 
            : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };
  
  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success": return "bg-green-100 text-green-800";
      case "error": return "bg-red-100 text-red-800";
      case "warning": return "bg-yellow-100 text-yellow-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success": return <Check className="h-4 w-4" />;
      case "error": return <X className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="h-5 w-5" />
          الإشعارات
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>لا توجد إشعارات</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-auto">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-3 rounded-lg border flex items-start justify-between gap-4 ${notification.is_read ? 'opacity-70' : 'border-primary/50'}`}
                onClick={() => !notification.is_read && markAsRead(notification.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getNotificationColor(notification.type)}>
                      {getNotificationIcon(notification.type)}
                    </Badge>
                    {!notification.is_read && (
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                    )}
                  </div>
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(notification.created_at), 'PPpp', { locale: ar })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
