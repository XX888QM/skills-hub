"use client";

import { useState } from "react";

export function CopyButton({ text, label = "复制" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-10 shrink-0 items-center rounded-full bg-[#f5f5f5] px-4 text-sm font-medium text-[#0a0a0a] transition-opacity duration-200 hover:opacity-85"
    >
      {copied ? "已复制" : label}
    </button>
  );
}
