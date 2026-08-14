import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { PageFrame } from "@/components/PageFrame";
import { SkillContent } from "@/components/SkillContent";
import { decodeSkillId, installCommand, skillHref, splitSkillId } from "@/lib/format";
import { getSiteUrl, siteConfig } from "@/lib/site";
import { loadSkillDetail, searchSkills } from "@/lib/sources";
import { localizeDetail } from "@/lib/translate";

export const revalidate = 180;

async function loadRawSkill(parts: string[]) {
  const id = decodeSkillId(parts);
  const hint = (await searchSkills(splitSkillId(id).name)).find(
    (item) => item.id === id || item.source === splitSkillId(id).source,
  );
  const raw = await loadSkillDetail(id, hint);
  return { id, raw };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string[] }>;
}): Promise<Metadata> {
  const { id: parts } = await params;
  const { id, raw } = await loadRawSkill(parts);
  if (!raw) return { title: "未找到 Skill" };
  const path = skillHref(id);
  const description =
    raw.description ||
    `${raw.name} 是托管在 ${raw.source} 的公开 Agent Skill。可在汇总skill 阅读说明书并复制安装命令。`;
  return {
    title: raw.name,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${raw.name} · ${siteConfig.name}`,
      description,
      url: path,
      type: "article",
      images: [],
    },
    twitter: {
      card: "summary",
      title: `${raw.name} · ${siteConfig.name}`,
      description,
      images: [],
    },
  };
}

function skillJsonLd(skill: {
  name: string;
  description?: string;
  source: string;
  githubUrl?: string;
  id: string;
}) {
  const url = `${getSiteUrl()}${skillHref(skill.id)}`;
  const command = installCommand(skill.source);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: skill.name,
        name: skill.name,
        description: skill.description,
        url,
        inLanguage: "zh-CN",
        author: {
          "@type": "Organization",
          name: skill.source,
          ...(skill.githubUrl ? { url: skill.githubUrl } : {}),
        },
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          url: getSiteUrl(),
        },
        mainEntityOfPage: url,
      },
      {
        "@type": "SoftwareApplication",
        name: skill.name,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Cross-platform",
        description: skill.description
          ? `${skill.description} 安装命令：${command}`
          : `公开 Agent Skill。安装命令：${command}`,
        url,
        ...(skill.githubUrl ? { downloadUrl: skill.githubUrl } : {}),
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "CNY",
        },
      },
    ],
  };
}

export default async function SkillPage({
  params,
}: {
  params: Promise<{ id: string[] }>;
}) {
  const { id: parts } = await params;
  const { raw } = await loadRawSkill(parts);
  if (!raw) notFound();
  const skill = await localizeDetail(raw);

  return (
    <PageFrame>
      <JsonLd data={skillJsonLd(skill)} />
      <SkillContent skill={skill} />
    </PageFrame>
  );
}
