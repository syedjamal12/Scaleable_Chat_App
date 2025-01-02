import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import SessionProvider from "@/components/providers/SessionProvider";

const fontSans = FontSans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quick Chat App",
  description: "To chatting witout login",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <SessionProvider>
      <body
className={cn(
  "min-h-screen bg-background font-sans antialiased",
  fontSans.variable
)}      >
        {children}
      </body>

      </SessionProvider>
      
    </html>
  );
}
