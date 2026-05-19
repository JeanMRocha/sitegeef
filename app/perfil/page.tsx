import type { Metadata } from "next";
import { getRequestLocale } from "@/lib/multilingual";
import { ProfilePageView } from "@/components/profile-page";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();

  return {
    title: locale === "en" ? "User Profile | GEEF" : "Perfil do usuário | GEEF",
    description:
      locale === "en"
        ? "User profile area powered by Supabase Auth."
        : "Base profissional do módulo de perfil de usuário com Supabase Auth.",
  };
}

export default async function Page() {
  const locale = await getRequestLocale();
  return <ProfilePageView locale={locale} />;
}
