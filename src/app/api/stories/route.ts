import { NextResponse } from "next/server";

interface HNStory {
  title: string;
  url: string;
  score: number;
  by: string;
}

export async function GET() {
  try {
    // Fetch top stories from Hacker News API
    const topRes = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );
    const topIds: number[] = await topRes.json();

    // Grab top 10 stories
    const storyPromises = topIds.slice(0, 10).map(async (id) => {
      const res = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      return res.json() as Promise<HNStory>;
    });

    const stories = await Promise.all(storyPromises);

    const formatted = stories
      .filter((s) => s.url)
      .map((s) => ({
        title: s.title,
        source: "Hacker News",
        url: s.url,
        score: s.score,
        take: "", // You fill in your POV
      }));

    return NextResponse.json({
      fetched: new Date().toISOString(),
      stories: formatted,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}
