import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInstitutionBrand } from "@/lib/institution-brand";
import { getMusicaSessaoComMusica } from "@/lib/musicas";
import { MusicaDisplayLive } from "@/components/musicas/musica-display-live";

type PageProps = {
  params: Promise<{ codigo: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { codigo } = await params;
  return {
    title: `Exibição ${codigo} - Músicas GEEF`,
    description: "Tela de exibição pareada para músicas do GEEF.",
  };
}

export default async function MusicaExibicaoPage({ params }: PageProps) {
  const { codigo } = await params;
  const [brand, data] = await Promise.all([getInstitutionBrand(), getMusicaSessaoComMusica(codigo)]);

  if (!data) {
    notFound();
  }

  return (
    <MusicaDisplayLive
      codigo={codigo}
      initialSessao={data.sessao}
      initialMusica={data.musica}
      logoSrc={brand.logoSemFundoUrl}
    />
  );
}
