import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

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
  <Toaster richColors duration={10000}/>
        {children}
      </body>

      </SessionProvider>
      
    </html>
  );
}
