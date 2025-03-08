
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface SettingsTabProps {
  userProfile: {
    notificationsEnabled: boolean;
    autoCheckEnabled: boolean;
    autoCheckInterval: number;
  };
  setUserProfile: (profile: any) => void;
  resetOnboarding: () => Promise<void>;
}

export function SettingsTab({ 
  userProfile, 
  setUserProfile,
  resetOnboarding 
}: SettingsTabProps) {
  // Enable or disable automatic checking
  useEffect(() => {
    const setupAutoCheck = async () => {
      try {
        if (userProfile.autoCheckEnabled) {
          // Schedule automatic checking
          console.log("Setting up auto-check with interval:", userProfile.autoCheckInterval);
          
          // Call check function periodically
          const checkFunction = async () => {
            try {
              const { data, error } = await supabase.functions.invoke('auto-check-analyses');
              
              if (error) {
                console.error("Error invoking auto-check function:", error);
              } else if (data) {
                console.log("Auto-check completed:", data);
                // Dispatch history update event with timestamp
                if (data.timestamp) {
                  const event = new CustomEvent('historyUpdated', {
                    detail: { timestamp: data.timestamp }
                  });
                  window.dispatchEvent(event);
                }
              }
            } catch (err) {
              console.error("Error during auto-check:", err);
            }
          };
          
          // Execute initial check
          checkFunction();
          
          // Schedule check every 5 minutes
          const intervalId = setInterval(checkFunction, 5 * 60 * 1000);
          
          return () => {
            clearInterval(intervalId);
          };
        }
      } catch (error) {
        console.error("Error setting up auto-check:", error);
      }
    };
    
    setupAutoCheck();
  }, [userProfile.autoCheckEnabled, userProfile.autoCheckInterval]);

  return (
    <div className="grid gap-4 py-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Notifications</Label>
          <p className="text-sm text-muted-foreground">
            Receive notifications when targets and stop losses are reached
          </p>
        </div>
        <Switch
          checked={userProfile.notificationsEnabled}
          onCheckedChange={(checked) => setUserProfile({ ...userProfile, notificationsEnabled: checked })}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Automatic Check</Label>
          <p className="text-sm text-muted-foreground">
            Automatically check analyses and compare with current prices every 5 minutes
          </p>
        </div>
        <Switch
          checked={userProfile.autoCheckEnabled}
          onCheckedChange={(checked) => {
            setUserProfile({ ...userProfile, autoCheckEnabled: checked });
            if (checked) {
              toast.success("Automatic check activated every 5 minutes");
            } else {
              toast.info("Automatic check deactivated");
            }
          }}
        />
      </div>
      
      <div className="space-y-2 pt-4">
        <Button
          variant="outline"
          onClick={resetOnboarding}
          className="w-full"
        >
          Restart Onboarding Tour
        </Button>
        
        <Button
          variant="outline"
          className="w-full"
        >
          Clear Analysis History
        </Button>
      </div>
    </div>
  );
}
