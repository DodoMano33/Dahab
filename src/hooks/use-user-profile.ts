
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useTheme } from "@/hooks/use-theme";

export function useUserProfile(user: any) {
  const [userProfile, setUserProfile] = useState({
    displayName: "",
    theme: "system" as "light" | "dark" | "system",
    email: "",
    notificationsEnabled: true,
    autoCheckEnabled: false,
    autoCheckInterval: 30,
  });
  
  const [profileLoading, setProfileLoading] = useState(true);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
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
      
      setTheme(userProfile.theme);
      
      toast.success("تم تحديث البيانات الشخصية بنجاح");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("حدث خطأ أثناء تحديث البيانات");
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

  return {
    userProfile,
    setUserProfile,
    profileLoading,
    showProfileDialog,
    setShowProfileDialog,
    showHelpDialog,
    setShowHelpDialog,
    activeTab,
    setActiveTab,
    handleSignOut,
    getUserInitials,
    updateProfile,
    resetOnboarding
  };
}
