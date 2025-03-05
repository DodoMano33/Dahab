
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProfileTabProps {
  userProfile: {
    displayName: string;
    email: string;
  };
  setUserProfile: (profile: any) => void;
  user: any;
}

export function ProfileTab({ userProfile, setUserProfile, user }: ProfileTabProps) {
  return (
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
  );
}
