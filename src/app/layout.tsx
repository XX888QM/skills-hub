import type { Metadata, Viewport } from "next";
import { Geist_Mono, Noto_Sans_SC } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
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

export const metadata: Metadata = {
  title: "汇总 — Agent Skills 市场",
  description: "检索 GitHub 上的公开 Agent Skills，预览说明书，复制安装命令。",
  icons: {
    icon: "/logo-hub.png",
    apple: "/logo-hub.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${sans.variable} ${mono.variable} ${sans.className} font-sans antialiased`}>
        <Header />
        <main className="min-h-[70vh] w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
