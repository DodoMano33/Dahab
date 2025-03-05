
import { User, LogOut, Settings, UserCircle, Bell, Moon, Sun, Monitor, HelpCircle } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/hooks/use-theme";
import type { Theme } from "@/hooks/use-theme";

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
  const { theme, setTheme } = useTheme();

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
  );
}
