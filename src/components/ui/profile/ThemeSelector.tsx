
import { Sun, Moon, Monitor } from "lucide-react";
import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/use-theme";
import type { Theme } from "@/hooks/use-theme";

interface ThemeSelectorProps {
  theme: Theme;
  userProfile: {
    theme: "light" | "dark" | "system";
  };
  setUserProfile: (profile: any) => void;
  updateProfile: () => Promise<void>;
}

export function ThemeSelector({
  theme,
  userProfile,
  setUserProfile,
  updateProfile
}: ThemeSelectorProps) {
  const { setTheme } = useTheme();

  return (
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
  );
}
