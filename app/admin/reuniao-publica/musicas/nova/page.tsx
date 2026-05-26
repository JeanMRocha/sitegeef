import Link from "next/link";
import { IconArrowLeft } from "@/components/icons";
import { MusicaEditorForm } from "@/components/admin/musicas/musica-editor-form";
import { saveMusicaAction } from "../actions";
import { listMusicaAutores } from "@/lib/musicas";

export const metadata = {
  title: "Nova música - Admin GEEF",
};

export default async function NovaMusicaPage() {
  const autores = await listMusicaAutores();

  return (
    <div className="area-page">
      <div className="admin-page-header">
        <div>
          <span className="admin-dashboard-kicker">Músicas</span>
          <h1 className="admin-page-title">Nova música</h1>
        </div>
        <Link href="/admin/reuniao-publica/musicas" className="admin-btn admin-btn-secondary" title="Voltar">
          <IconArrowLeft size={18} />
        </Link>
      </div>

      <section className="area-section">
        <div className="admin-card table-surface">
          <div className="area-section-title">
            <h2>Detalhes da música</h2>
            <p>Preencha os campos básicos e organize as partes da letra (estrofes, refrões, pontes).</p>
          </div>

          <MusicaEditorForm action={saveMusicaAction} autores={autores} submitLabel="Criar música" />
        </div>
      </section>
    </div>
  );
}
