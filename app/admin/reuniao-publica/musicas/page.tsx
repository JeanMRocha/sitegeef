import { Suspense } from "react";
import { AdminModuleGate } from "@/components/admin/admin-module-gate";
import { MusicasCatalogTable } from "@/components/admin/musicas/musicas-catalog-table";
import { listMusicas } from "@/lib/musicas";

export const metadata = {
  title: "Músicas - Reunião pública - Admin GEEF",
};

type PageProps = {
  searchParams?: Promise<{ q?: string; salvo?: string }>;
};

async function MusicasContent({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const q = typeof params.q === "string" ? params.q : "";
  const isSaved = params.salvo === "1";

  const musicas = await listMusicas();

  return <MusicasCatalogTable musicas={musicas} initialQuery={q} isSaved={isSaved} />;
}

export default function MusicasPage(props: PageProps) {
  return (
    <AdminModuleGate
      permission="pode_publicar"
      profiles={["diretoria", "secretaria", "comunicacao"]}
      redirectPath="/admin/reuniao-publica/musicas"
      title="Músicas"
    >
      <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>}>
        <MusicasContent {...props} />
      </Suspense>
    </AdminModuleGate>
  );
}
