import { revalidatePath, revalidateTag } from "next/cache";

export const ADMIN_DASHBOARD_CACHE_TAG = "admin-dashboard";
export const ADMIN_BIBLIOTECA_CACHE_TAG = "admin-biblioteca";
export const ADMIN_DOCUMENTOS_CACHE_TAG = "admin-documentos";

export function invalidateAdminDashboardCache() {
  revalidateTag(ADMIN_DASHBOARD_CACHE_TAG);
  revalidatePath("/admin");
}

export function invalidateAdminBibliotecaCache() {
  revalidateTag(ADMIN_BIBLIOTECA_CACHE_TAG);
  revalidatePath("/admin/biblioteca");
  revalidatePath("/admin/biblioteca/emprestimos");
  revalidatePath("/admin/biblioteca/reservas");
}

export function invalidateAdminDocumentosCache() {
  revalidateTag(ADMIN_DOCUMENTOS_CACHE_TAG);
  revalidatePath("/admin/documentos");
  revalidatePath("/admin/documentos/termos");
  revalidatePath("/admin/documentos/consentimentos");
  revalidatePath("/admin/documentos/voluntariado");
}
