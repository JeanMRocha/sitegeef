import type { Metadata } from "next";
import { Manrope, Fredoka } from "next/font/google";
import { SiteShell } from "@/components/site-shell";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import { createClient } from "@/lib/supabase/server";
import { UserPersistenceWrapper } from "@/components/user-persistence-wrapper";
import { NotificationProvider } from "@/components/providers/NotificationProvider";
import { NotificationFlashBridge } from "@/components/notification-flash-bridge";
import { getHtmlLang, getRequestLocale } from "@/lib/multilingual";
import "@/styles/theme.css";
import "@/styles/globals.css";
import "@/styles/site-header.css";

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
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  return (
    <html lang={getHtmlLang(locale)} suppressHydrationWarning>
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>
        <ThemeProvider>
          <NotificationProvider>
            <NotificationFlashBridge />
            <UserPersistenceWrapper user={user}>
              <SiteShell locale={locale} user={user}>
                {children}
              </SiteShell>
            </UserPersistenceWrapper>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
