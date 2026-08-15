"use client";

import type { ReactNode } from "react";
import { formatInstalls, formatRelativeTime } from "@/lib/format";
import { originLabel } from "@/lib/translate";
import type { SkillOrigin } from "@/lib/types";
import { KeepTogether } from "./KeepTogether";
import { useI18n } from "./I18nProvider";

export function Tx({
  k,
  values,
}: {
  k: string;
  values?: Record<string, string | number>;
}) {
  const { t } = useI18n();
  return <KeepTogether>{t(k, values)}</KeepTogether>;
}

export function TxInstalls({ value }: { value?: number }) {
  const { locale } = useI18n();
  return <span className="whitespace-nowrap">{formatInstalls(value, locale)}</span>;
}

export function TxTime({ iso }: { iso?: string }) {
  const { locale } = useI18n();
  return <span className="whitespace-nowrap">{formatRelativeTime(iso, locale)}</span>;
}

export function TxUpdated({ iso }: { iso?: string }) {
  const { locale, t } = useI18n();
  return (
    <span className="whitespace-nowrap">
      {t("catalog.updated", { time: formatRelativeTime(iso, locale) })}
    </span>
  );
}

export function TxOrigin({ origin }: { origin: SkillOrigin }) {
  const { locale } = useI18n();
  return <span className="whitespace-nowrap">{originLabel(origin, locale)}</span>;
}

export function TxBusy({
  k,
  className,
  children,
}: {
  k: string;
  className?: string;
  children: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <div className={className} aria-busy="true" aria-label={t(k)}>
      {children}
    </div>
  );
}
