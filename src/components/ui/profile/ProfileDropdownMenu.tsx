
import { useTheme } from "@/hooks/use-theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileMenuItems } from "./ProfileMenuItems";

interface ProfileDropdownMenuProps {
  user: any;
  userProfile: {
    displayName: string;
    theme: "light" | "dark" | "system";
    email: string;
  };
  setUserProfile: (profile: any) => void;
  profileLoading: boolean;
  handleSignOut: () => Promise<void>;
  setActiveTab: (tab: string) => void;
  setShowProfileDialog: (show: boolean) => void;
  setShowHelpDialog: (show: boolean) => void;
  updateProfile: () => Promise<void>;
  getUserInitials: (email?: string) => string;
}

export function ProfileDropdownMenu({
  user,
  userProfile,
  setUserProfile,
  profileLoading,
  handleSignOut,
  setActiveTab,
  setShowProfileDialog,
  setShowHelpDialog,
  updateProfile,
  getUserInitials
}: ProfileDropdownMenuProps) {
  const { theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{getUserInitials(user?.email)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <ProfileHeader 
          profileLoading={profileLoading} 
          userProfile={userProfile} 
          userEmail={user?.email} 
        />
        <DropdownMenuSeparator />
        <ProfileMenuItems 
          theme={theme}
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          updateProfile={updateProfile}
          setActiveTab={setActiveTab}
          setShowProfileDialog={setShowProfileDialog}
          setShowHelpDialog={setShowHelpDialog}
          handleSignOut={handleSignOut}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
