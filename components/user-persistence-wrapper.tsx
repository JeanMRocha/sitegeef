"use client";

import { useUserPersistence } from "@/hooks/useUserPersistence";
import { usePageTracking } from "@/hooks/usePageTracking";
import type { User } from "@supabase/supabase-js";

type UserPersistenceWrapperProps = {
  user: User | null;
  children: React.ReactNode;
};

/**
 * Wrapper que cuida de persistência automática de dados do usuário
 */
export function UserPersistenceWrapper({
  user,
  children,
}: UserPersistenceWrapperProps) {
  // Persistir dados do usuário automaticamente
  useUserPersistence(user);

  // Rastrear página visitada
  usePageTracking();

  return <>{children}</>;
}
