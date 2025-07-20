"use client";

import { useState } from "react";
import { NotificationData } from "../notifications-schema";
import { Bell, AlertCircle, Package, Shield, Users } from "lucide-react";

// Mock data based on Figma design
const mockNotifications: NotificationData[] = [
  {
    id: "1",
    type: "daily_summary",
    title: "Daily Summary",
    message:
      "128 new orders\n24 new client sign-ups\n8 new vendors\n6 returns processed\nMost active hub: Alger-Centre",
    timestamp: "Il ya 20 min",
    isRead: false,
    isHighPriority: true,
  },
  {
    id: "2",
    type: "order_delay",
    title: "Order Processing Delay",
    message:
      '32 orders have been in "Pending" status for over 2 hours. Affected vendors: FashionDZ, ElectroMax.',
    timestamp: "Il ya 20 min",
    isRead: false,
    isHighPriority: false,
  },
  {
    id: "3",
    type: "security_alert",
    title: "Security Alert: Unusual Activity",
    message:
      "A login attempt was detected from Nigeria on the admin account yahia.admin@plateforme.dz at 03:17.",
    timestamp: "Il ya 20 min",
    isRead: false,
    isHighPriority: true,
  },
  {
    id: "4",
    type: "order_delay",
    title: "Order Processing Delay",
    message:
      '32 orders have been in "Pending" status for over 2 hours. Affected vendors: FashionDZ, ElectroMax.',
    timestamp: "Il ya 20 min",
    isRead: false,
    isHighPriority: false,
  },
];

function getNotificationIcon(type: string) {
  switch (type) {
    case "daily_summary":
      return <Bell className="w-5 h-5" />;
    case "order_delay":
      return <Package className="w-5 h-5" />;
    case "security_alert":
      return <Shield className="w-5 h-5" />;
    case "vendor_registration":
      return <Users className="w-5 h-5" />;
    default:
      return <AlertCircle className="w-5 h-5" />;
  }
}

function NotificationItem({
  notification,
}: {
  notification: NotificationData;
}) {
  const getBackgroundColor = (isHighPriority: boolean) => {
    return isHighPriority
      ? "bg-orange-50 border-orange-100" // Orange tinted background
      : "bg-white border-gray-200"; // White background
  };

  const getIconBackgroundColor = (isHighPriority: boolean) => {
    return isHighPriority
      ? "bg-orange-100" // Orange tinted icon background
      : "bg-orange-100"; // Same orange tinted icon background for all
  };

  return (
    <div
      className={`${getBackgroundColor(
        notification.isHighPriority
      )} border rounded-2xl p-5 flex gap-3`}
    >
      {/* Icon with notification indicator */}
      <div className="relative">
        <div
          className={`${getIconBackgroundColor(
            notification.isHighPriority
          )} rounded-full p-4 flex items-center justify-center`}
        >
          <div className="text-orange-500">
            {getNotificationIcon(notification.type)}
          </div>
        </div>
        {/* Red notification dot */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-4">
        <div className="space-y-3">
          <div className="text-gray-900 font-bold text-base leading-tight">
            {notification.title}
          </div>
          <div className="text-gray-900 font-bold text-base leading-tight whitespace-pre-line">
            {notification.message}
          </div>
        </div>
        <div className="text-gray-900 font-bold text-sm">
          {notification.timestamp}
        </div>
      </div>
    </div>
  );
}

export function NotificationsList() {
  const [notifications] = useState<NotificationData[]>(mockNotifications);

  return (
    <div className="space-y-6">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
}
