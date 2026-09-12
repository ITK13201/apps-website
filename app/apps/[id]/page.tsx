import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAllApps, getAppById } from "@/lib/apps";
import PlatformBadge from "@/components/PlatformBadge";

export function generateStaticParams() {
  const apps = getAllApps();
  return apps.map((app) => ({ id: app.id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AppDetailPage({ params }: PageProps) {
  const { id } = await params;
  const app = getAppById(id);

  if (!app) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-brand transition-colors mb-6"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-6 mb-6">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-700">
              <Image
                src={app.icon}
                alt={`${app.name} icon`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {app.name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {app.category}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {app.platforms.map((platform) => (
                  <PlatformBadge key={platform.type} type={platform.type} />
                ))}
              </div>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
            {app.description}
          </p>

          {app.screenshots.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Screenshots
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 sm:-mx-8 px-6 sm:px-8">
                {app.screenshots.map((screenshot, index) => (
                  <div
                    key={index}
                    className="relative shrink-0 w-48 h-96 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700"
                  >
                    <Image
                      src={screenshot}
                      alt={`${app.name} screenshot ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Download
            </h2>
            {app.platforms.map((platform) => (
              <a
                key={platform.type}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-5 py-3 bg-brand text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                <span>{platform.type}</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            ))}

            {app.githubUrl && (
              <a
                href={app.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-5 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                <span>View Source</span>
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
