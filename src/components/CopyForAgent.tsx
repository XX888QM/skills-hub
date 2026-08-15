"use client";

import { useState } from "react";
import { useI18n } from "@/components/I18nProvider";
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
  const { t, locale } = useI18n();
  const [copied, setCopied] = useState(false);

  async function copy() {
    const page =
      typeof window !== "undefined"
        ? skillId
          ? `${window.location.origin}${skillHref(skillId)}`
          : window.location.href
        : "";
    await navigator.clipboard.writeText(agentInstallPrompt({ source, name, page, locale }));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full border border-border px-4 text-sm font-medium transition-colors duration-200 hover:bg-muted"
    >
      {copied ? t("copy.agentDone") : t("copy.agent")}
    </button>
  );
}
