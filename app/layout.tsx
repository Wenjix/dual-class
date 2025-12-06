import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dual Class - JIT Learning Engine",
  description: "Learn complex concepts through personalized metaphors powered by Gemini",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
