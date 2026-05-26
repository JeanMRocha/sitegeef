import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard - Admin GEEF",
};

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  redirect("/admin/painel");
}
