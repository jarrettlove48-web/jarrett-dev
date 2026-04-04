import fs from "fs";
import path from "path";

export interface Photo {
  src: string;
  alt: string;
}

export interface LifestyleEvent {
  slug: string;
  title: string;
  date: string;
  location: string;
  description: string;
  photos: Photo[];
}

const LIFESTYLE_DIR = path.join(process.cwd(), "src/content/lifestyle");

export function getAllEvents(): LifestyleEvent[] {
  if (!fs.existsSync(LIFESTYLE_DIR)) return [];
  const files = fs.readdirSync(LIFESTYLE_DIR).filter((f) => f.endsWith(".json"));
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(LIFESTYLE_DIR, file), "utf-8");
      return JSON.parse(raw) as LifestyleEvent;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
