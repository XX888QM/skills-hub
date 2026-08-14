"use client";

import { useState } from "react";
import { agentInstallPrompt, skillHref } from "@/lib/format";

export function CopyForAgent({
  source,
  name,
  skillId,
}: {
  source: string;
  name?: string;
  skillId?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const page =
      typeof window !== "undefined"
        ? skillId
          ? `${window.location.origin}${skillHref(skillId)}`
          : window.location.href
        : "";
    await navigator.clipboard.writeText(agentInstallPrompt({ source, name, page }));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-10 items-center rounded-full border border-border px-4 text-sm font-medium transition-colors duration-200 hover:bg-muted"
    >
      {copied ? "已复制，去对话里粘贴" : "复制给 Agent"}
    </button>
  );
}
