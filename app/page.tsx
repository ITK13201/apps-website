import { getAllApps, getAllCategories } from "@/lib/apps";
import AppCatalog from "@/components/AppCatalog";

export default function HomePage() {
  const apps = getAllApps();
  const categories = getAllCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AppCatalog apps={apps} categories={categories} />
    </div>
  );
}
