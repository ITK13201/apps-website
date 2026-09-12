export type PlatformType =
  | "iOS"
  | "Android"
  | "Windows"
  | "macOS"
  | "Desktop Web"
  | "Mobile Web";

export interface Platform {
  type: PlatformType;
  url: string;
}

export interface App {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  category: string;
  icon: string;
  screenshots: string[];
  githubUrl?: string;
  platforms: Platform[];
}
