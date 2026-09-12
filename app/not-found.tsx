import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold text-gray-200 dark:text-gray-700 mb-4">
        404
      </h1>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
        Page not found
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-brand text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
      >
        Back to Home
      </Link>
    </div>
  );
}
