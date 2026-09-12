import appsData from "@/data/apps.json";
import type { App } from "@/types/app";

const apps: App[] = appsData as App[];

export function getAllApps(): App[] {
  return apps;
}

export function getAppById(id: string): App | undefined {
  return apps.find((app) => app.id === id);
}

export function getAllCategories(): string[] {
  const categories = apps.map((app) => app.category);
  return Array.from(new Set(categories));
}
