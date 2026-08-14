import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = {
  title: pageMeta.submit.title,
  description: pageMeta.submit.description,
  alternates: { canonical: "/submit" },
  openGraph: {
    title: `${pageMeta.submit.title} · 汇总skill`,
    description: pageMeta.submit.description,
    url: "/submit",
  },
};

export default function SubmitLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
