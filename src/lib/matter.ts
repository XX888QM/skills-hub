import matter from "gray-matter";

function rejectEngine() {
  return {};
}

export function safeMatter(markdown: string) {
  try {
    return matter(markdown, {
      language: "yaml",
      engines: {
        javascript: rejectEngine,
        js: rejectEngine,
        coffee: rejectEngine,
        coffeescript: rejectEngine,
      },
    });
  } catch {
    return { data: {} as Record<string, unknown>, content: markdown };
  }
}
