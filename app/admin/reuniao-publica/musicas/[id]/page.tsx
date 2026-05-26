import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteMusicaButton } from "@/components/admin/musicas/delete-musica-button";
import { MusicaEditorForm } from "@/components/admin/musicas/musica-editor-form";
import { getMusicaById } from "@/lib/musicas";
import { saveMusicaAction } from "../actions";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata = {
  title: "Editar música - Admin GEEF",
};

export default async function EditarMusicaPage({ params }: PageProps) {
  const { id } = await params;
  const musica = await getMusicaById(id);

  if (!musica) {
    notFound();
  }

  return (
    <div className="area-page">
      <div className="admin-page-header">
        <div>
          <span className="admin-dashboard-kicker">Músicas</span>
          <h1 className="admin-page-title">Editar música</h1>
        </div>
        <Link href="/admin/reuniao-publica/musicas" className="admin-btn admin-btn-secondary">
          Voltar
        </Link>
      </div>

      <section className="area-section">
        <div className="admin-card table-surface">
          <div className="area-section-title">
            <h2>{musica.titulo}</h2>
            <p>por {musica.autor}</p>
          </div>

          <MusicaEditorForm musica={musica} action={saveMusicaAction} submitLabel="Salvar alterações" />

          <DeleteMusicaButton musicaId={musica.id} musicaTitulo={musica.titulo} />
        </div>
      </section>
    </div>
  );
}
