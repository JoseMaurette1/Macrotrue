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
