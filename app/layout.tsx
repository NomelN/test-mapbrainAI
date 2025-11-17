import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Posts App",
  description: "A Next.js 15 application to browse posts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
