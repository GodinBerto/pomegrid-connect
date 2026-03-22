import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Pomegrid",
  description:
    "A B2B marketplace connecting agricultural producers with global importers.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="font-sans scrollbar-hide"
        style={
          {
            "--font-sans":
              '"Segoe UI", "Helvetica Neue", "Liberation Sans", sans-serif',
            "--font-display":
              '"Avenir Next", "Gill Sans", "Trebuchet MS", sans-serif',
          } as CSSProperties
        }
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
