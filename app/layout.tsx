import type { Metadata } from "next";
import { Manrope, Fredoka } from "next/font/google";
import { SiteShell } from "@/components/site-shell";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import { createClient } from "@/lib/supabase/server";
import { UserPersistenceWrapper } from "@/components/user-persistence-wrapper";
import { NotificationProvider } from "@/components/providers/NotificationProvider";
import { ToastContainer } from "@/components/ui/toast-notification";
import { getHtmlLang, getRequestLocale } from "@/lib/multilingual";
import { withTimeout } from "@/lib/admin/safe-supabase";
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

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();

  return {
    title: "GEEF",
    description:
      locale === "en"
        ? "Public site of Grupo Espírita Elias Francis."
        : "Site público do Grupo Espírita Elias Francis.",
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
      apple: "/favicon.png",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();
  const client = await createClient();
  const authResult = await withTimeout(
    client.auth.getUser() as Promise<any>,
    4500,
    { data: { user: null }, error: null } as any,
  );
  const user = authResult.data.user;

  return (
    <html lang={getHtmlLang(locale)} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function () {
  try {
    var saved = localStorage.getItem('geef-theme');
    var theme = saved === 'dark' ? 'dark' : 'light';
    window.__GEEF_THEME__ = theme;
    var root = document.documentElement;
    var pathname = window.location.pathname || '';
    if (pathname.startsWith('/musicas/exibir')) {
      root.classList.add('musica-display-route');
    } else {
      root.classList.remove('musica-display-route');
    }
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  } catch (e) {}
})();`,
          }}
        />
      </head>
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>
        <ThemeProvider>
          <NotificationProvider>
            <UserPersistenceWrapper user={user}>
              <SiteShell locale={locale} user={user}>
                {children}
              </SiteShell>
            </UserPersistenceWrapper>
          </NotificationProvider>
        </ThemeProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
