import Link from "next/link";
import { notFound } from "next/navigation";
import { IconArrowLeft } from "@/components/icons";
import { DeleteMusicaButton } from "@/components/admin/musicas/delete-musica-button";
import { MusicaEditorForm } from "@/components/admin/musicas/musica-editor-form";
import { getMusicaById, listMusicaAutores } from "@/lib/musicas";
import { saveMusicaAction } from "../actions";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ salvo?: string }>;
};

export const metadata = {
  title: "Editar música - Admin GEEF",
};

export default async function EditarMusicaPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const params_data = (await searchParams) ?? {};
  const isSaved = params_data.salvo === "1";
  const [musica, autores] = await Promise.all([getMusicaById(id), listMusicaAutores()]);

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
        <Link href="/admin/reuniao-publica/musicas" className="admin-btn admin-btn-secondary" title="Voltar">
          <IconArrowLeft size={18} />
        </Link>
      </div>

      {isSaved && (
        <div style={{ padding: "1rem", backgroundColor: "rgba(34, 197, 94, 0.1)", borderRadius: "0.5rem", marginBottom: "1rem" }}>
          <p style={{ margin: 0, color: "#16a34a", fontSize: "0.95rem" }}>✓ Música salva com sucesso!</p>
        </div>
      )}

      <section className="area-section">
        <div className="admin-card table-surface">
          <div className="area-section-title">
            <h2>{musica.titulo}</h2>
            <p>por {musica.autor}</p>
          </div>

          <MusicaEditorForm musica={musica} autores={autores} action={saveMusicaAction} submitLabel="Salvar alterações" />

          <DeleteMusicaButton musicaId={musica.id} musicaTitulo={musica.titulo} />
        </div>
      </section>
    </div>
  );
}
