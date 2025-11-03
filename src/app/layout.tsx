import type { Metadata } from "next";
import "./globals.css";
import AuthProviderWrapper from '@/components/AuthProviderWrapper'

// Utilisation d'une police système temporaire pour éviter les problèmes avec Google Fonts + Turbopack
const fontClassName = "font-system";

export const metadata: Metadata = {
  title: "EustacheApp",
  description: "Application moderne avec Next.js et Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="font-sans antialiased"
      >
        <AuthProviderWrapper>
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
