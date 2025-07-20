import { z } from "zod";

export const notificationTypeSchema = z.enum([
  "daily_summary",
  "order_delay",
  "security_alert",
  "vendor_registration",
  "system_maintenance",
  "general",
]);

export const notificationSchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  message: z.string(),
  timestamp: z.string(),
  isRead: z.boolean().default(false),
  isHighPriority: z.boolean().default(false),
});

export type NotificationType = z.infer<typeof notificationTypeSchema>;
export type NotificationData = z.infer<typeof notificationSchema>;
