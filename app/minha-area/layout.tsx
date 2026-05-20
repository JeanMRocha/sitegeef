import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { NotificationFlashBridge } from "@/components/notification-flash-bridge";

export default async function MinhaAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/minha-area");
  }

  return (
    <Suspense fallback={null}>
      <NotificationFlashBridge />
      {children}
    </Suspense>
  );
}
