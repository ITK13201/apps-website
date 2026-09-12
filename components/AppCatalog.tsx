"use client";

import { useState, useMemo } from "react";
import AppCard from "@/components/AppCard";
import type { App } from "@/types/app";

interface AppCatalogProps {
  apps: App[];
  categories: string[];
}

export default function AppCatalog({ apps, categories }: AppCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesCategory =
        selectedCategory === "All" || app.category === selectedCategory;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        query === "" ||
        app.name.toLowerCase().includes(query) ||
        app.description.toLowerCase().includes(query) ||
        app.shortDescription.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [apps, searchQuery, selectedCategory]);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 max-w-md">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search apps..."
            className="w-full px-4 py-2 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-transparent focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-1.5 text-sm rounded-full font-medium transition-colors ${
              selectedCategory === "All"
                ? "bg-brand text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 text-sm rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-brand text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredApps.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No apps found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </>
  );
}
