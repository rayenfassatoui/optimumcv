import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { FloatingDownloadButton } from "@/components/ui/floating-download-button";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OptimumCV — AI-Powered Professional CV Builder",
  description:
    "Build, enhance, and adapt professional CVs in minutes. Import existing resumes, collaborate with AI to polish each section, tailor content to any job description, and instantly export pixel-perfect PDFs. Generate motivation letters and optimize for ATS.",
  keywords: [
    "CV builder",
    "resume builder",
    "AI CV generator",
    "professional resume",
    "ATS optimization",
    "job application",
    "motivation letter",
    "career tools",
    "CV templates",
    "resume templates",
    "AI resume writer",
    "curriculum vitae",
    "job search",
    "career development",
  ],
  authors: [
    { name: "Rayen Fassatoui", url: "https://github.com/rayenfassatoui" },
  ],
  creator: "Rayen Fassatoui",
  publisher: "OptimumCV",
  metadataBase: new URL("https://cv.rayenft.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cv.rayenft.dev",
    title: "OptimumCV — AI-Powered Professional CV Builder",
    description:
      "Build, enhance, and adapt professional CVs in minutes. Import existing resumes, collaborate with AI to polish each section, tailor content to any job description, and instantly export pixel-perfect PDFs.",
    siteName: "OptimumCV",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "OptimumCV - AI CV Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OptimumCV — AI-Powered Professional CV Builder",
    description:
      "Build, enhance, and adapt professional CVs in minutes with AI-powered tools.",
    images: ["/og.jpg"],
    creator: "@rayenfassatoui",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "antialiased min-h-screen bg-background text-foreground"
        )}
        suppressHydrationWarning
      >
        <ThemeProvider>
          {children}
          <FloatingDownloadButton />
          <Toaster
            position="bottom-center"
            richColors
            expand={false}
            closeButton
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
