import type { Metadata } from "next";
import { Manrope, Fredoka } from "next/font/google";
import { SiteShell } from "@/components/site-shell";
import "@/styles/globals.css";

const headingFont = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "GEEF",
  description: "Site público do Grupo Espírita Elias Francis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
