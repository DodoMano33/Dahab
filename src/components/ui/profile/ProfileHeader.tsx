
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenuLabel } from "@/components/ui/dropdown-menu";

interface ProfileHeaderProps {
  profileLoading: boolean;
  userProfile: {
    displayName: string;
  };
  userEmail: string | undefined;
}

export function ProfileHeader({ 
  profileLoading, 
  userProfile, 
  userEmail 
}: ProfileHeaderProps) {
  return (
    <DropdownMenuLabel>
      {profileLoading ? (
        <Skeleton className="h-4 w-24" />
      ) : (
        <div className="flex flex-col">
          <span>{userProfile.displayName || "مستخدم"}</span>
          <span className="text-xs text-muted-foreground truncate">{userEmail}</span>
        </div>
      )}
    </DropdownMenuLabel>
  );
}
