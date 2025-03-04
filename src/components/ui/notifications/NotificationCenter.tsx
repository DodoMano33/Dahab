
import { useState, useEffect } from "react";
import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  type: 'success' | 'error' | 'info' | 'warning';
  link?: string;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem("notifications-enabled") === "true";
  });
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn || !user) {
      return;
    }

    // جلب الإشعارات عند التحميل
    fetchNotifications();

    // الاشتراك للإشعارات الجديدة
    const notificationsChannel = supabase
      .channel('notifications_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notificationsChannel);
    };
  }, [isLoggedIn, user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        throw error;
      }

      if (data) {
        setNotifications(data as Notification[]);
        setUnreadCount(data.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      ));
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      if (!user) return;

      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
      setUnreadCount(0);
      toast.success('تم تحديد جميع الإشعارات كمقروءة');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('حدث خطأ أثناء تحديث الإشعارات');
    }
  };

  const clearAllNotifications = async () => {
    try {
      if (!user) return;

      await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      setNotifications([]);
      setUnreadCount(0);
      toast.success('تم حذف جميع الإشعارات');
    } catch (error) {
      console.error('Error clearing notifications:', error);
      toast.error('حدث خطأ أثناء حذف الإشعارات');
    }
  };

  const toggleNotifications = (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    localStorage.setItem("notifications-enabled", enabled.toString());
    toast(
      enabled ? 'تم تفعيل الإشعارات' : 'تم إيقاف الإشعارات',
      { description: enabled ? 'ستتلقى إشعارات عند تحقق الأهداف ووقف الخسائر' : 'لن تتلقى إشعارات جديدة' }
    );
  };

  // إذا لم يكن المستخدم مسجلاً، لا تعرض زر الإشعارات
  if (!isLoggedIn) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs" variant="destructive">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>الإشعارات</SheetTitle>
          <SheetDescription>
            آخر التحديثات والتنبيهات الخاصة بتحليلاتك
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Switch 
              id="notifications" 
              checked={notificationsEnabled}
              onCheckedChange={toggleNotifications}
            />
            <label htmlFor="notifications" className="text-sm">
              تفعيل الإشعارات
            </label>
          </div>
          
          {notifications.length > 0 && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                تحديد الكل كمقروء
              </Button>
              <Button variant="ghost" size="sm" onClick={clearAllNotifications}>
                حذف الكل
              </Button>
            </div>
          )}
        </div>
        
        <div className="space-y-4 mt-2 max-h-[calc(80vh-10rem)] overflow-y-auto pb-6">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد إشعارات
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`
                  border rounded-lg p-3 relative 
                  ${notification.read ? 'bg-background' : 'bg-muted/50 border-primary/20'}
                `}
              >
                <div className="flex justify-between">
                  <h4 className="text-sm font-medium">
                    {notification.title}
                  </h4>
                  <div className="flex gap-1">
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.message}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(notification.created_at).toLocaleString('ar-SA')}
                  </span>
                  {notification.link && (
                    <Button variant="link" size="sm" className="h-auto p-0" asChild>
                      <a href={notification.link}>عرض التفاصيل</a>
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        <SheetFooter className="mt-4">
          <SheetClose asChild>
            <Button variant="outline" className="w-full">إغلاق</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
