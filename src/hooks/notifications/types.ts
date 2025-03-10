
export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: Date;
  type: "success" | "error" | "info" | "warning";
  link?: string;
}
