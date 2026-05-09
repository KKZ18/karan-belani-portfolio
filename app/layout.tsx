import React from "react";
import { Metadata } from "next";
import { Playfair_Display, Instrument_Sans, DM_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import { VideoDialogProvider } from "@/components/ui/VideoDialogContext";
import VideoDialog from "@/components/ui/VideoDialog";

import "@/styles.css";
import { TailwindIndicator } from "@/components/ui/breakpoint-indicator";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["300", "400", "500"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://karanbelani.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Karan Belani — Network Security Engineer',
    template: '%s | Karan Belani',
  },
  description: 'Network Security Engineer specialising in routing, switching, VPN security, and network automation. Writing about CCNA, CCNP, and real-world lab setups.',
  keywords: ['network engineer', 'network security', 'CCNA', 'CCNP', 'DMVPN', 'Cisco', 'routing', 'switching', 'VPN', 'network automation'],
  authors: [{ name: 'Karan Belani', url: SITE_URL }],
  creator: 'Karan Belani',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Karan Belani',
    title: 'Karan Belani — Network Security Engineer',
    description: 'Network Security Engineer specialising in routing, switching, VPN security, and network automation.',
    url: SITE_URL,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Karan Belani — Network Security Engineer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Karan Belani — Network Security Engineer',
    description: 'Network Security Engineer specialising in routing, switching, VPN security, and network automation.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(playfair.variable, instrumentSans.variable, dmMono.variable)}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <VideoDialogProvider>
            {children}
            <VideoDialog />
          </VideoDialogProvider>
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
