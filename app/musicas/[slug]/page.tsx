import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInstitutionBrand } from "@/lib/institution-brand";
import { getMusicaBySlug } from "@/lib/musicas";
import { MusicaReader } from "@/components/musicas/musica-reader";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const musica = await getMusicaBySlug(slug);

  if (!musica) {
    return {
      title: "Música não encontrada - GEEF",
    };
  }

  return {
    title: `${musica.titulo} - Músicas GEEF`,
    description: `Letra e cifra de ${musica.titulo} por ${musica.autor}.`,
  };
}

export default async function MusicaPage({ params }: PageProps) {
  const { slug } = await params;
  const [musica, brand] = await Promise.all([getMusicaBySlug(slug), getInstitutionBrand()]);

  if (!musica || musica.status !== "ativa") {
    notFound();
  }

  return <MusicaReader musica={musica} logoSrc={brand.logoSemFundoUrl} />;
}
