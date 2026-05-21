import { Suspense } from "react";
import { AdminDashboardWorkspace } from "@/components/admin/admin-dashboard-workspace";
import { getCachedAdminDashboardSummary } from "@/lib/admin/dashboard";

export const metadata = {
  title: "Dashboard - Admin GEEF",
};

export const dynamic = "force-dynamic";

async function AdminDashboardContent() {
  const summary = await getCachedAdminDashboardSummary();

  return <AdminDashboardWorkspace summary={summary} />;
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
