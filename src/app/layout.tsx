import type { Metadata } from "next";
import { ThemeProvider } from "./components/theme-provider";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Macrotrue",
  description: "Yummy Recipes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={inter.className}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>{children}</ThemeProvider>
      </body>
    </html>
  );
}
