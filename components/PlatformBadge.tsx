import type { PlatformType } from "@/types/app";

const platformConfig: Record<
  PlatformType,
  { label: string; className: string }
> = {
  iOS: {
    label: "iOS",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  Android: {
    label: "Android",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  Windows: {
    label: "Windows",
    className:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  },
  macOS: {
    label: "macOS",
    className:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  },
  "Desktop Web": {
    label: "Desktop Web",
    className:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
  "Mobile Web": {
    label: "Mobile Web",
    className:
      "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  },
};

interface PlatformBadgeProps {
  type: PlatformType;
}

export default function PlatformBadge({ type }: PlatformBadgeProps) {
  const config = platformConfig[type];
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${config.className}`}
    >
      {config.label}
    </span>
  );
}
