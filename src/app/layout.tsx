import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "./components/theme-provider";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { PWAProvider } from "@/components/pwa";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#36343d" },
    { media: "(prefers-color-scheme: dark)", color: "#36343d" },
  ],
};

export const metadata: Metadata = {
  title: "Macrotrue",
  description: "Track your meals and workouts with personalized calorie goals",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Macrotrue",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icons/icon-512x512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
  },
  applicationName: "Macrotrue",
  keywords: ["fitness", "meal tracking", "calorie counter", "workout", "health"],
  authors: [{ name: "Macrotrue Team" }],
  creator: "Macrotrue",
  publisher: "Macrotrue",
  category: "Health & Fitness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Macrotrue" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>
        <ClerkProvider
          appearance={{
            elements: {
              rootBox: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
              },
            },
          }}
        >
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
            <PWAProvider>{children}</PWAProvider>
          </ThemeProvider>
          <Toaster closeButton expand={false} richColors />
        </ClerkProvider>
      </body>
    </html>
  );
}
