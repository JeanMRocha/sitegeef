import { getInstitutionBrand } from "@/lib/institution-brand";
import { getMusicaExibicaoAtual } from "@/lib/musicas";
import { MusicaDisplayLive } from "@/components/musicas/musica-display-live";

export const metadata = {
  title: "Exibição pública - Músicas GEEF",
  description: "Tela pública ao vivo para músicas do GEEF.",
};

export default async function MusicasExibirPage() {
  const [brand, exibicaoAtual] = await Promise.all([getInstitutionBrand(), getMusicaExibicaoAtual()]);

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
