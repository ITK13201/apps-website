import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ITK Apps",
  description: "ITK が開発・公開しているアプリの一覧サイト",
  metadataBase: new URL("https://apps.i-tk.dev"),
  manifest: "/manifest.json",
  openGraph: {
    title: "ITK Apps",
    description: "ITK が開発・公開しているアプリの一覧サイト",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ITK Apps",
    description: "ITK が開発・公開しているアプリの一覧サイト",
    images: ["/og-image.png"],
  },
  other: {
    "theme-color": "#0071E3",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${notoSansJP.variable} font-sans bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white min-h-screen flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
