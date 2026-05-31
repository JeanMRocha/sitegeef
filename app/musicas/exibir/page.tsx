import { getInstitutionBrand } from "@/lib/institution-brand";
import { getMusicaExibicaoPublicaAtual } from "@/lib/musicas";
import { MusicaDisplayLive } from "@/components/musicas/musica-display-live";

export const metadata = {
  title: "Exibição pública - Músicas GEEF",
  description: "Tela pública ao vivo para músicas do GEEF.",
};

export const dynamic = "force-dynamic";

export default async function MusicasExibirPage() {
  const [brand, exibicaoAtual] = await Promise.all([getInstitutionBrand(), getMusicaExibicaoPublicaAtual()]);

  return (
    <MusicaDisplayLive
      logoSrc={brand.logoSemFundoUrl}
      initialSessao={exibicaoAtual?.sessao ?? null}
      initialMusica={exibicaoAtual?.musica ?? null}
      pollUrl="/api/musicas/exibicao"
      showPairingInfo={false}
    />
  );
}
