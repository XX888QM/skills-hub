import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import { Geist_Mono, Noto_Sans_SC } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { I18nProvider } from "@/components/I18nProvider";
import { JsonLd, siteJsonLd } from "@/components/JsonLd";
import { localeBootScript, localeMeta, LOCALE_COOKIE, resolveLocale } from "@/lib/i18n";
import { getSiteUrl, siteConfig } from "@/lib/site";
import "./globals.css";

const sans = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto",
  display: "swap",
  adjustFontFallback: false,
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.defaultTitle,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name, url: siteConfig.repoUrl }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  applicationName: siteConfig.name,
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: {
      "zh-CN": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: siteConfig.name,
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    url: "/",
    images: [{ url: "/logo-hub.png", alt: siteConfig.name }],
  },
  twitter: {
    card: "summary",
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: ["/logo-hub.png"],
  },
  icons: {
    icon: "/logo-hub.png",
    apple: "/logo-hub.png",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieLocale = (await cookies()).get(LOCALE_COOKIE)?.value;
  const accept = (await headers()).get("accept-language");
  const initialLocale = resolveLocale(cookieLocale, accept);

  return (
    <html
      lang={localeMeta[initialLocale].html}
      data-locale={initialLocale}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: localeBootScript }} />
      </head>
      <body className={`${sans.variable} ${mono.variable} ${sans.className} font-sans antialiased`}>
        <I18nProvider initialLocale={initialLocale}>
          <JsonLd data={siteJsonLd()} />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-[#f5f5f5] focus:px-4 focus:py-2 focus:text-[#0a0a0a]"
          >
            跳到正文
          </a>
          <Header />
          <main id="main" className="min-h-[70vh] w-full">
            {children}
          </main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
