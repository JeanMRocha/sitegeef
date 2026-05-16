import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Institucional - GEEF',
  description: 'Credibilidade, filiações e reconhecimentos da GEEF. Federação Espírita Brasileira, REUNIR II Serrana, 45º CEU.'
};

export default function InstitucionalPage() {
  return (
    <main className="content-page">
      {/* Header */}
      <div className="content-hero">
        <h1>Credibilidade e Filiações</h1>
        <p className="content-summary">
          GEEF é uma instituição espírita reconhecida e filiada às principais entidades de representação do espiritismo no Brasil.
        </p>
      </div>

      {/* Conteúdo */}
      <div style={{ maxWidth: '42rem', margin: '0 auto', padding: '0 1rem' }}>

        {/* FEB */}
        <div className="content-card">
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, marginBottom: '0.5rem', color: 'var(--uva)' }}>
              🏛️ Federação Espírita Brasileira (FEB)
            </h3>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>
              Fundada em 1884 | Entidade de Utilidade Pública
            </p>
          </div>

          <p style={{ margin: '0.75rem 0 0' }}>
            A Federação Espírita Brasileira é a instituição máxima de representação do espiritismo no país. Responsável pela disseminação e preservação da Doutrina Espírita, coordena centros espíritas em todo o território nacional e mantém contato com federações espíritas internacionais.
          </p>

          <ul style={{ margin: '1rem 0 0', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li>Missão: disseminar a Doutrina Espírita para formação de boas pessoas</li>
            <li>Estrutura: Conselho Superior, Federativo Nacional e coordenação por estados</li>
            <li>Presença: Brasil e praticamente todos os países com movimento espírita</li>
            <li>Serviços: educação, pesquisa, publicações, FEBtv e programação institucional</li>
          </ul>

          <a
            href="https://www.febnet.org.br"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', marginTop: '1rem', color: 'var(--uva)', fontWeight: 600, textDecoration: 'none' }}
          >
            Visite febnet.org.br →
          </a>
        </div>

        {/* REUNIR II */}
        <div className="content-card" style={{ marginTop: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, marginBottom: '0.5rem', color: 'var(--leaf-soft)' }}>
              🌿 REUNIR II Serrana
            </h3>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>
              Rio de Janeiro | Federação Estadual
            </p>
          </div>

          <p style={{ margin: '0.75rem 0 0' }}>
            A REUNIR (Reunião de Unificação de Centros Espíritas) é responsável pela integração e coordenação de centros espíritas em suas regiões de atuação. A REUNIR II Serrana cobre a região serrana do Rio de Janeiro, promovendo unidade de doutrina e ação entre os centros filiados.
          </p>

          <ul style={{ margin: '1rem 0 0', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li>Coordenação: Centros espíritas da região Serrana</li>
            <li>Função: unificar doutrina, ação e fraternidade</li>
            <li>Área de atuação: Região Serrana do Rio de Janeiro</li>
            <li>Vínculo: Federação Estadual Espírita do RJ</li>
          </ul>
        </div>

        {/* 45º CEU */}
        <div className="content-card" style={{ marginTop: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, marginBottom: '0.5rem', color: 'var(--vine)' }}>
              📍 45º Centro Espírita Unificado (CEU)
            </h3>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>
              Coordenação Regional | Região Serrana - RJ
            </p>
          </div>

          <p style={{ margin: '0.75rem 0 0' }}>
            O 45º Centro Espírita Unificado é a coordenação de segundo grau que integra e orienta os centros espíritas de sua região, assegurando a conformidade com as diretrizes da Doutrina Espírita e promovendo a fraternidade e a cooperação entre as instituições.
          </p>

          <ul style={{ margin: '1rem 0 0', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li>Estrutura: Coordenação regional de centros espíritas</li>
            <li>Hierarquia: Filiado à REUNIR II Serrana</li>
            <li>Responsabilidade: orientação doutrinária e administrativa</li>
            <li>Foco: unidade, fraternidade e ação espírita</li>
          </ul>
        </div>

        {/* GEEF */}
        <div className="content-card" style={{ marginTop: '1.5rem', backgroundColor: 'rgba(99, 213, 31, 0.06)', borderColor: 'var(--leaf)' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, marginBottom: '0.5rem', color: 'var(--leaf)' }}>
              ✨ GEEF - Grupo de Estudo Esotérico Familial
            </h3>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>
              Casa Espírita Filiada
            </p>
          </div>

          <p style={{ margin: '0.75rem 0 0' }}>
            O GEEF atua como centro espírita reconhecido, alinhado com os princípios da Federação Espírita Brasileira. Integrado na estrutura federativa, o GEEF realiza suas atividades em conformidade com a Doutrina Espírita, promovendo estudo, prática e disseminação dos princípios espíritas.
          </p>

          <ul style={{ margin: '1rem 0 0', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li>Filiação: Federação Espírita Brasileira</li>
            <li>Regional: REUNIR II Serrana</li>
            <li>Coordenação: 45º Centro Espírita Unificado</li>
            <li>Atividades: reuniões públicas, evangelização, palestras, passes</li>
          </ul>
        </div>

        {/* Estrutura Hierárquica */}
        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-alt)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 1.5rem', color: 'var(--text)' }}>Estrutura Hierárquica</h3>

          <div style={{ display: 'grid', gap: '1rem', maxWidth: '100%' }}>
            <div style={{ padding: '0.75rem', background: 'white', borderRadius: '0.5rem', border: '2px solid var(--uva)' }}>
              <strong style={{ color: 'var(--uva)' }}>Federação Espírita Brasileira (FEB)</strong>
            </div>

            <div style={{ fontSize: '1.5rem', color: 'var(--muted)' }}>↓</div>

            <div style={{ padding: '0.75rem', background: 'white', borderRadius: '0.5rem', border: '2px solid var(--leaf-soft)' }}>
              <strong style={{ color: 'var(--leaf-soft)' }}>REUNIR II Serrana (RJ)</strong>
            </div>

            <div style={{ fontSize: '1.5rem', color: 'var(--muted)' }}>↓</div>

            <div style={{ padding: '0.75rem', background: 'white', borderRadius: '0.5rem', border: '2px solid var(--vine)' }}>
              <strong style={{ color: 'var(--vine)' }}>45º Centro Espírita Unificado</strong>
            </div>

            <div style={{ fontSize: '1.5rem', color: 'var(--muted)' }}>↓</div>

            <div style={{ padding: '0.75rem', background: 'rgba(99, 213, 31, 0.1)', borderRadius: '0.5rem', border: '2px solid var(--leaf)' }}>
              <strong style={{ color: 'var(--leaf)' }}>GEEF</strong>
            </div>
          </div>
        </div>

        {/* Compromisso */}
        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'rgba(138, 0, 90, 0.04)', borderLeft: '4px solid var(--uva)', borderRadius: '0.5rem' }}>
          <h3 style={{ margin: '0 0 0.75rem', color: 'var(--uva)' }}>Nosso Compromisso</h3>
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            Como instituição espírita filiada à Federação Espírita Brasileira, o GEEF se compromete com:
          </p>
          <ul style={{ margin: '1rem 0 0', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li><strong>Doutrina:</strong> conformidade rigorosa com os princípios espíritas</li>
            <li><strong>Transparência:</strong> operação clara e responsável</li>
            <li><strong>Comunidade:</strong> serviço desinteressado à coletividade</li>
            <li><strong>Educação:</strong> disseminação do conhecimento espírita</li>
            <li><strong>Fraternidade:</strong> ação conjunta com demais centros</li>
          </ul>
        </div>

      </div>
    </main>
  );
}
