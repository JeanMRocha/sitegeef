import { Suspense } from "react";
import { AdminDashboardWorkspace } from "@/components/admin/admin-dashboard-workspace";
import { getCachedAdminDashboardSummary } from "@/lib/admin/dashboard";

async function AdminAreaContent() {
  const summary = await getCachedAdminDashboardSummary();

  return <AdminDashboardWorkspace summary={summary} />;
}

export function AdminAreaPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <AdminAreaContent />
    </Suspense>
  );
}
