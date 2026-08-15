import { getSiteUrl, siteConfig } from "@/lib/site";

type JsonLdValue = Record<string, unknown> | Record<string, unknown>[];

export function JsonLd({ data }: { data: JsonLdValue }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function siteJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        name: siteConfig.name,
        alternateName: [siteConfig.nameEn, siteConfig.repoName],
        url,
        inLanguage: "zh-CN",
        description:
          "汇总skill 是中文 Agent Skills 市场。检索 GitHub 上的公开 Agent Skill 与 SKILL.md，阅读说明书，复制安装命令。",
        publisher: { "@id": `${url}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${url}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${url}/#organization`,
        name: siteConfig.name,
        alternateName: siteConfig.nameEn,
        url,
        logo: `${url}/logo-hub.png`,
        sameAs: [siteConfig.repoUrl],
      },
      {
        "@type": "WebApplication",
        "@id": `${url}/#app`,
        name: siteConfig.name,
        alternateName: siteConfig.nameEn,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "CNY",
        },
        audience: {
          "@type": "Audience",
          audienceType: "Developers",
        },
        url,
        publisher: { "@id": `${url}/#organization` },
      },
    ],
  };
}
