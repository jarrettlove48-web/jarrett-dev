import fs from "fs";
import path from "path";

export interface Story {
  tag: string;
  title: string;
  body: string[];
  take: string;
}

export interface BlogPost {
  slug: string;
  issue: number;
  title: string;
  date: string;
  summary: string;
  intro: string;
  stories: Story[];
}

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".json"));
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      return JSON.parse(raw) as BlogPost;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(slug: string): BlogPost | undefined {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug);
}
