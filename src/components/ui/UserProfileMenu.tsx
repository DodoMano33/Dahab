import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { User, LogOut, Settings, UserCircle, Bell, Moon, Sun, Monitor, HelpCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/use-theme";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationCenter } from "./notifications/NotificationCenter";
import { OnboardingDialog } from "./onboarding/OnboardingDialog";

export function UserProfileMenu() {
  const { user, isLoggedIn } = useAuth();
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [userProfile, setUserProfile] = useState({
    displayName: "",
    theme: "system" as "light" | "dark" | "system",
    email: "",
    notificationsEnabled: true,
    autoCheckEnabled: false,
    autoCheckInterval: 30,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setProfileLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        setUserProfile({
          displayName: data.display_name || "",
          email: data.email || user?.email || "",
          theme: data.theme || "system",
          notificationsEnabled: data.notifications_enabled !== false,
          autoCheckEnabled: data.auto_check_enabled || false,
          autoCheckInterval: data.auto_check_interval || 30,
        });

        // Updating the theme if it's different
        if (data.theme !== theme) {
          setTheme(data.theme as 'light' | 'dark' | 'system');
        }
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("تم تسجيل الخروج بنجاح");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    }
  };

  const getUserInitials = (email?: string) => {
    if (!email) return "؟";
    return email.charAt(0).toUpperCase();
  };

  const updateProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await supabase
        .from('profiles')
        .update({
          id: user.id,
          email: user.email,
          display_name: userProfile.displayName,
          theme: userProfile.theme,
          notifications_enabled: userProfile.notificationsEnabled,
          auto_check_enabled: userProfile.autoCheckEnabled,
          auto_check_interval: userProfile.autoCheckInterval,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      // Updating the theme
      setTheme(userProfile.theme);
      
      toast.success("تم تحديث البيانات الشخصية بنجاح");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("حدث خطأ أثناء تحديث البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  const resetOnboarding = async () => {
    if (!user) return;
    
    try {
      await supabase
        .from('profiles')
        .update({
          onboarding_completed: false
        })
        .eq('id', user.id);
      
      setShowProfileDialog(false);
      toast.success("تم إعادة تعيين جولة التعريف بنجاح");
      
      // Re-loading the page to start the onboarding process
      window.location.reload();
    } catch (error) {
      console.error("Error resetting onboarding:", error);
      toast.error("حدث خطأ أثناء إعادة تعيين جولة التعريف");
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <NotificationCenter />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{getUserInitials(user?.email)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            {profileLoading ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              <div className="flex flex-col">
                <span>{userProfile.displayName || "مستخدم"}</span>
                <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
              </div>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => {
              setActiveTab("profile");
              setShowProfileDialog(true);
            }}>
              <UserCircle className="ml-2 h-4 w-4" />
              <span>البيانات الشخصية</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              setActiveTab("settings");
              setShowProfileDialog(true);
            }}>
              <Settings className="ml-2 h-4 w-4" />
              <span>الإعدادات</span>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                {theme === "light" && <Sun className="ml-2 h-4 w-4" />}
                {theme === "dark" && <Moon className="ml-2 h-4 w-4" />}
                {theme === "system" && <Monitor className="ml-2 h-4 w-4" />}
                <span>السمة</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => {
                    setTheme("light" as Theme);
                    setUserProfile({ ...userProfile, theme: "light" });
                    updateProfile();
                  }}>
                    <Sun className="ml-2 h-4 w-4" />
                    <span>فاتح</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    setTheme("dark" as Theme);
                    setUserProfile({ ...userProfile, theme: "dark" });
                    updateProfile();
                  }}>
                    <Moon className="ml-2 h-4 w-4" />
                    <span>داكن</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    setTheme("system" as Theme);
                    setUserProfile({ ...userProfile, theme: "system" });
                    updateProfile();
                  }}>
                    <Monitor className="ml-2 h-4 w-4" />
                    <span>تلقائي</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem onClick={() => setShowHelpDialog(true)}>
              <HelpCircle className="ml-2 h-4 w-4" />
              <span>المساعدة</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="ml-2 h-4 w-4" />
            <span>تسجيل الخروج</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* حوار البيانات الشخصية */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>البيانات الشخصية والإعدادات</DialogTitle>
            <DialogDescription>
              قم بتعديل بياناتك الشخصية وإعدادات التطبيق هنا.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-4">
              <TabsTrigger value="profile">البيانات الشخصية</TabsTrigger>
              <TabsTrigger value="settings">الإعدادات</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="displayName" className="text-right">
                    الاسم المعروض
                  </Label>
                  <Input
                    id="displayName"
                    value={userProfile.displayName}
                    onChange={(e) => setUserProfile({ ...userProfile, displayName: e.target.value })}
                    className="col-span-3"
                    placeholder="ادخل اسمك هنا"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    البريد الإلكتروني
                  </Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="col-span-3"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>الإشعارات</Label>
                    <p className="text-sm text-muted-foreground">
                      تلقي إشعارات عند تحقق الأهداف ووقف الخسارة
                    </p>
                  </div>
                  <Switch
                    checked={userProfile.notificationsEnabled}
                    onCheckedChange={(checked) => setUserProfile({ ...userProfile, notificationsEnabled: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>الفحص التلقائي</Label>
                    <p className="text-sm text-muted-foreground">
                      فحص تلقائي للتحليلات ومقارنتها بالأسعار الحالية
                    </p>
                  </div>
                  <Switch
                    checked={userProfile.autoCheckEnabled}
                    onCheckedChange={(checked) => setUserProfile({ ...userProfile, autoCheckEnabled: checked })}
                  />
                </div>
                
                {userProfile.autoCheckEnabled && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="checkInterval" className="text-right">
                      الفاصل الزمني (دقائق)
                    </Label>
                    <Input
                      id="checkInterval"
                      type="number"
                      min={5}
                      max={120}
                      value={userProfile.autoCheckInterval}
                      onChange={(e) => setUserProfile({ 
                        ...userProfile, 
                        autoCheckInterval: parseInt(e.target.value) || 30
                      })}
                      className="col-span-3"
                    />
                  </div>
                )}
                
                <div className="space-y-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={resetOnboarding}
                    className="w-full"
                  >
                    إعادة تشغيل جولة التعريف
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                  >
                    مسح سجل التحليلات
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="flex justify-between items-center">
            <Button variant="ghost" onClick={() => setShowProfileDialog(false)}>
              إلغاء
            </Button>
            <Button type="submit" onClick={updateProfile} disabled={isLoading}>
              {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* ��وار المساعدة */}
      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>مساعدة ودليل استخدام التطبيق</DialogTitle>
            <DialogDescription>
              دليل سريع لاستخدام منصة تحليل الأسواق المالية
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">تحليل الرسوم البيانية</h3>
              <p className="text-sm text-muted-foreground">
                يمكنك تحليل الرسوم البيانية باستخدام عدة أنماط تحليلية مثل السكالبينج، SMC، ICT وغيرها. اختر رمز الزوج، الإطار الزمني، ونوع التحليل المطلوب ثم اضغط على زر "تحليل".
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">متابعة التحليلات</h3>
              <p className="text-sm text-muted-foreground">
                يمكنك متابعة التحليلات السابقة من خلال النقر على زر "سجل التحليلات". يعرض لك السجل جميع التحليلات مع إمكانية تصفيتها وفرزها.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">الإحصائيات</h3>
              <p className="text-sm text-muted-foreground">
                تعرض لوحة الإحصائيات أداء تحليلاتك حسب نوع التحليل والإطار الزمني، مما يساعدك على تحسين استراتيجيات التداول.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">الإشعارات</h3>
              <p className="text-sm text-muted-foreground">
                ستتلقى إشعارات عند تحقق أهداف التحليل أو تفعيل وقف الخسارة. يمكنك إدارة الإشعارات من خلال زر الجرس في شريط التنقل.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowHelpDialog(false)}>
              فهمت
            </Button>
            <Button variant="outline" onClick={() => {
              setShowHelpDialog(false);
              resetOnboarding();
            }}>
              عرض جولة التعريف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
