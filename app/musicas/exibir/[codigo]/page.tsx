import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInstitutionBrand } from "@/lib/institution-brand";
import { getMusicaBySlug, getMusicaSessaoComMusica } from "@/lib/musicas";
import { MusicaDisplayLive } from "@/components/musicas/musica-display-live";
import { MusicaReader } from "@/components/musicas/musica-reader";

type PageProps = {
  params: Promise<{ codigo: string }>;
};

async function resolveExibicao(codigo: string) {
  const musicaPorSlug = await getMusicaBySlug(codigo);
  if (musicaPorSlug) {
    return { tipo: "musica" as const, musica: musicaPorSlug };
  }

  const sessao = await getMusicaSessaoComMusica(codigo);
  if (sessao) {
    return { tipo: "sessao" as const, ...sessao };
  }

  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { codigo } = await params;
  const exibicao = await resolveExibicao(codigo);

  if (!exibicao) {
    return {
      title: "Exibição não encontrada - Músicas GEEF",
    };
  }

  if (exibicao.tipo === "musica") {
    return {
      title: `${exibicao.musica.titulo} - Exibição - Músicas GEEF`,
      description: `Exibição em tela cheia de ${exibicao.musica.titulo} por ${exibicao.musica.autor}.`,
    };
  }

  return {
    title: `Exibição ${codigo} - Músicas GEEF`,
    description: "Tela de exibição pareada para músicas do GEEF.",
  };
}

export default async function MusicaExibicaoPage({ params }: PageProps) {
  const { codigo } = await params;
  const [brand, exibicao] = await Promise.all([getInstitutionBrand(), resolveExibicao(codigo)]);

  if (!exibicao) {
    notFound();
  }

  if (exibicao.tipo === "musica") {
    return <MusicaReader musica={exibicao.musica} logoSrc={brand.logoSemFundoUrl} showBranding={false} />;
  }

  return (
    <MusicaDisplayLive
      codigo={codigo}
      logoSrc={brand.logoSemFundoUrl}
      initialSessao={exibicao.sessao}
      initialMusica={exibicao.musica}
      pollUrl={`/api/musicas/sessoes/${encodeURIComponent(codigo)}`}
      showPairingInfo={false}
    />
  );
}
