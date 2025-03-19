
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTab } from "./ProfileTab";
import { SettingsTab } from "./SettingsTab";
import { useTheme } from "@/hooks/use-theme";
import type { Theme } from "@/hooks/use-theme";

interface ProfileDialogProps {
  showProfileDialog: boolean;
  setShowProfileDialog: (show: boolean) => void;
  userProfile: {
    displayName: string;
    theme: "light" | "dark" | "system";
    email: string;
    notificationsEnabled: boolean;
    autoCheckEnabled: boolean;
    autoCheckInterval: number;
    priceUpdateInterval: number;
    metalPriceApiKey: string;
  };
  setUserProfile: (profile: any) => void;
  user: any;
}

export function ProfileDialog({
  showProfileDialog,
  setShowProfileDialog,
  userProfile,
  setUserProfile,
  user
}: ProfileDialogProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const { setTheme } = useTheme();

  const updateProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // نرسل فقط الحقول الموجودة فعلاً في جدول profiles
      // وليس كل حقول userProfile
      await supabase
        .from('profiles')
        .update({
          display_name: userProfile.displayName,
          theme: userProfile.theme,
          notifications_enabled: userProfile.notificationsEnabled,
          metal_price_api_key: userProfile.metalPriceApiKey,
          price_update_interval: userProfile.priceUpdateInterval,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      setTheme(userProfile.theme as Theme);
      
      toast.success("تم تحديث البيانات الشخصية بنجاح");
      setShowProfileDialog(false);
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
      
      window.location.reload();
    } catch (error) {
      console.error("Error resetting onboarding:", error);
      toast.error("حدث خطأ أثناء إعادة تعيين جولة التعريف");
    }
  };

  const handleCloseDialog = () => {
    setShowProfileDialog(false);
  };

  return (
    <Dialog open={showProfileDialog} onOpenChange={handleCloseDialog}>
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
            <ProfileTab 
              userProfile={userProfile} 
              setUserProfile={setUserProfile} 
              user={user}
            />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <SettingsTab 
              userProfile={userProfile} 
              setUserProfile={setUserProfile} 
              resetOnboarding={resetOnboarding}
            />
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between items-center">
          <Button variant="ghost" onClick={handleCloseDialog}>
            إلغاء
          </Button>
          <Button type="submit" onClick={updateProfile} disabled={isLoading}>
            {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
