import type { Metadata } from "next";
import { Inter, Rajdhani } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/Providers";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const rajdhani = Rajdhani({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-rajdhani",
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "vidver.ai - AI ilə Avtomobil Tuninqi",
    template: "%s | vidver.ai"
  },
  description: "Avtomobilinizi saniyələr içində yeni görkəmə gətirin. Şəkildən modifikasiya və effektli videolar – AI ilə, vidver.ai-də.",
  keywords: ["avtomobil tuning", "AI tuning", "avtomobil modifikasiya", "şəkildən video"],
  authors: [{ name: "vidver.ai" }],
  creator: "vidver.ai",
  openGraph: {
    type: "website",
    locale: "az_AZ",
    url: "https://vidver.ai",
    title: "vidver.ai - AI ilə Avtomobil Tuninqi",
    description: "Avtomobilinizi saniyələr içində yeni görkəmə gətirin",
    siteName: "vidver.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "vidver.ai - AI ilə Avtomobil Tuninqi",
    description: "Avtomobilinizi saniyələr içində yeni görkəmə gətirin",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az" suppressHydrationWarning>
      <body className={cn(
        inter.variable,
        rajdhani.variable,
        "font-sans antialiased min-h-screen pb-16 lg:pb-0"
      )}>
        <Providers>
          {children}
          <MobileBottomNav />
        </Providers>
      </body>
    </html>
  );
}
