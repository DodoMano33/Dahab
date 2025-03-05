
import { useAuth } from "@/contexts/AuthContext";
import { NotificationCenter } from "./notifications/NotificationCenter";
import { ProfileDropdownMenu } from "./profile/ProfileDropdownMenu";
import { ProfileDialog } from "./profile/ProfileDialog";
import { HelpDialog } from "./help/HelpDialog";
import { useUserProfile } from "@/hooks/use-user-profile";

export function UserProfileMenu() {
  const { user, isLoggedIn } = useAuth();
  const {
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
  } = useUserProfile(user);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <NotificationCenter />
      
      <ProfileDropdownMenu 
        user={user}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        profileLoading={profileLoading}
        handleSignOut={handleSignOut}
        setActiveTab={setActiveTab}
        setShowProfileDialog={setShowProfileDialog}
        setShowHelpDialog={setShowHelpDialog}
        updateProfile={updateProfile}
        getUserInitials={getUserInitials}
      />

      <ProfileDialog
        showProfileDialog={showProfileDialog}
        setShowProfileDialog={setShowProfileDialog}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        user={user}
      />
      
      <HelpDialog
        showHelpDialog={showHelpDialog}
        setShowHelpDialog={setShowHelpDialog}
        resetOnboarding={resetOnboarding}
      />
    </div>
  );
}
