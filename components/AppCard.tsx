import Link from "next/link";
import Image from "next/image";
import PlatformBadge from "@/components/PlatformBadge";
import type { App } from "@/types/app";

interface AppCardProps {
  app: App;
}

export default function AppCard({ app }: AppCardProps) {
  return (
    <Link
      href={`/apps/${app.id}`}
      className="group block bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-700">
            <Image
              src={app.icon}
              alt={`${app.name} icon`}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-brand transition-colors">
              {app.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {app.category}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
          {app.shortDescription}
        </p>
        <div className="flex flex-wrap gap-1">
          {app.platforms.map((platform) => (
            <PlatformBadge key={platform.type} type={platform.type} />
          ))}
        </div>
      </div>
    </Link>
  );
}
