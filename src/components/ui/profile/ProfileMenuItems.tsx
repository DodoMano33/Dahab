
import { UserCircle, Settings, HelpCircle, LogOut } from "lucide-react";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ThemeSelector } from "./ThemeSelector";

interface ProfileMenuItemsProps {
  theme: "light" | "dark" | "system";
  userProfile: {
    theme: "light" | "dark" | "system";
  };
  setUserProfile: (profile: any) => void;
  updateProfile: () => Promise<void>;
  setActiveTab: (tab: string) => void;
  setShowProfileDialog: (show: boolean) => void;
  setShowHelpDialog: (show: boolean) => void;
  handleSignOut: () => Promise<void>;
}

export function ProfileMenuItems({
  theme,
  userProfile,
  setUserProfile,
  updateProfile,
  setActiveTab,
  setShowProfileDialog,
  setShowHelpDialog,
  handleSignOut
}: ProfileMenuItemsProps) {
  return (
    <>
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
        <ThemeSelector 
          theme={theme}
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          updateProfile={updateProfile}
        />
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
    </>
  );
}
