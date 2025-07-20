import { cn } from "../../lib/utils";
import { useTranslations } from "next-intl";

interface StatusBadgeProps {
  status:
    | "active"
    | "inactive"
    | "pending"
    | "delivered"
    | "cancelled"
    | "processing"
    | "successful"
    | "failure"
    | "in-progress";
  className?: string;
  translationNamespace?: string;
}

export function StatusBadge({
  status,
  className,
  translationNamespace = "vendorsTable",
}: StatusBadgeProps) {
  const t = useTranslations(translationNamespace);

  const statusConfig = {
    active: {
      className:
        "bg-[var(--status-active-bg)] text-[var(--status-active-text)]",
      text: t("active"),
    },
    inactive: {
      className:
        "bg-[var(--status-inactive-bg)] text-[var(--status-inactive-text)]",
      text: t("inactive"),
    },
    pending: {
      className:
        "bg-[var(--status-pending-bg)] text-[var(--status-pending-text)]",
      text: t("pending"),
    },
    delivered: {
      className:
        "bg-[var(--status-delivered-bg)] text-[var(--status-delivered-text)]",
      text: t("delivered"),
    },
    cancelled: {
      className:
        "bg-[var(--status-cancelled-bg)] text-[var(--status-cancelled-text)]",
      text: t("cancelled"),
    },
    processing: {
      className:
        "bg-[var(--status-processing-bg)] text-[var(--status-processing-text)]",
      text: t("processing"),
    },
    successful: {
      className:
        "bg-[var(--status-successful-bg)] text-[var(--status-successful-text)]",
      text: t("successful"),
    },
    failure: {
      className:
        "bg-[var(--status-failure-bg)] text-[var(--status-failure-text)]",
      text: t("failure"),
    },
    "in-progress": {
      className:
        "bg-[var(--status-in-progress-bg)] text-[var(--status-in-progress-text)]",
      text: t("inProgress"),
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.text}
    </span>
  );
}
