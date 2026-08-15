import type { MetadataRoute } from "next";
import { scenePacks } from "@/lib/packs";
import { getSiteUrl } from "@/lib/site";
import { loadHotRepos } from "@/lib/stars";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { path: "/", changeFrequency: "daily", priority: 1 },
      { path: "/search", changeFrequency: "weekly", priority: 0.9 },
      { path: "/skills", changeFrequency: "daily", priority: 0.9 },
      { path: "/packs", changeFrequency: "weekly", priority: 0.8 },
      { path: "/guide", changeFrequency: "monthly", priority: 0.8 },
      { path: "/submit", changeFrequency: "monthly", priority: 0.6 },
    ] as const
  ).map((item) => ({
    url: `${base}${item.path === "/" ? "" : item.path}`,
    lastModified: now,
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));

  const packRoutes: MetadataRoute.Sitemap = scenePacks.map((pack) => ({
    url: `${base}/packs/${pack.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const repos = await loadHotRepos(40).catch(() => []);
  const skillRoutes: MetadataRoute.Sitemap = repos.map((item) => {
    const name = item.source.split("/")[1] ?? item.source;
    return {
      url: `${base}/s/${item.source}/${name}`,
      lastModified: item.pushedAt ? new Date(item.pushedAt) : now,
      changeFrequency: "weekly",
      priority: 0.6,
    };
  });

  return [...staticRoutes, ...packRoutes, ...skillRoutes];
}
