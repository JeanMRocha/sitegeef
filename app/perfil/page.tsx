import type { Metadata } from "next";
import { ProfilePageView } from "@/components/profile-page";

export const metadata: Metadata = {
  title: "Perfil do usuário | GEEF",
  description:
    "Base profissional do módulo de perfil de usuário com Supabase Auth.",
};

export default function Page() {
  return <ProfilePageView />;
}
