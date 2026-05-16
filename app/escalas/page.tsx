import { createClient } from '@/lib/supabase/server';
import { Suspense } from 'react';

export const metadata = {
  title: 'Escalas do GEEF',
};

function getMonthName(mes: number): string {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];
  return months[mes - 1];
}

async function EscalasContent() {
  const supabase = await createClient();

  // Get current year and month
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // Get escalas for current and next 3 months
  const { data: escalas, error } = await supabase
    .from('escalas_mensais')
    .select(
      `
      *,
      reunioes (
        id, data,
        escala_funcoes (
          funcao_id, pessoa_id, substituto_id,
          funcoes (nome),
          pessoas (nome),
          substitutos:pessoas!substituto_id (nome)
        ),
        escala_passe (
          pessoa_id, posicao,
          pessoas (nome)
        ),
        escala_evangelizacao (
          pessoa_id, tema_id, tema_livre, turma,
          pessoas (nome),
          temas_doutrinarios (titulo)
        ),
        escala_palestras (
          expositor_id, tema_id, tema_livre, cidade_origem, tipo_palestra,
          expositores:pessoas (nome),
          temas_doutrinarios (titulo)
        )
      )
    `
    )
    .eq('status', 'publicada')
    .gte('ano', currentYear)
    .order('ano', { ascending: true })
    .order('mes', { ascending: true });

  if (error) throw error;

  const escalasatuais = escalas?.filter(
    (e: any) => e.ano > currentYear || (e.ano === currentYear && e.mes >= currentMonth)
  );

  return (
    <div>
      {/* Header */}
      <div style={{ paddingBottom: '2rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: '0 0 0.5rem', fontSize: '2rem', fontWeight: 700 }}>Escalas do GEEF</h1>
        <p style={{ margin: 0, fontSize: '1rem', color: '#666' }}>
          Confira as escalas das reuniões e atividades
        </p>
      </div>

      {/* Escalas */}
      {escalasatuais && escalasatuais.length > 0 ? (
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {escalasatuais.map((escala: any) => (
            <div key={escala.id}>
              <h2 style={{
                margin: '0 0 1.5rem',
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#1a1a1a',
              }}>
                {getMonthName(escala.mes)} de {escala.ano}
              </h2>

              {/* Reuniões */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {escala.reunioes?.map((reuniao: any) => (
                  <div
                    key={reuniao.id}
                    style={{
                      padding: '1.5rem',
                      backgroundColor: '#f9f9f9',
                      border: '1px solid #e5e5e5',
                      borderRadius: '0.8rem',
                    }}
                  >
                    <h3 style={{
                      margin: '0 0 1.5rem',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: '#1a1a1a',
                    }}>
                      Quinta-feira, {new Date(reuniao.data + 'T00:00:00').toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </h3>

                    {/* Funções */}
                    {reuniao.escala_funcoes && reuniao.escala_funcoes.length > 0 && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem', fontWeight: 600, color: '#333' }}>
                          ⚙️ Funções
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {reuniao.escala_funcoes.map((ef: any, idx: number) => (
                            <div
                              key={idx}
                              style={{
                                padding: '0.75rem',
                                backgroundColor: '#fff',
                                borderRadius: '0.4rem',
                                fontSize: '0.9rem',
                                display: 'grid',
                                gridTemplateColumns: '120px 1fr 1fr',
                                gap: '1rem',
                              }}
                            >
                              <div>
                                <strong>{ef.funcoes?.nome}</strong>
                              </div>
                              <div>
                                {ef.pessoas?.nome}
                              </div>
                              <div style={{ color: '#666', fontSize: '0.85rem' }}>
                                {ef.substitutos?.nome && `(Sub: ${ef.substitutos.nome})`}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Passe */}
                    {reuniao.escala_passe && reuniao.escala_passe.length > 0 && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem', fontWeight: 600, color: '#333' }}>
                          💫 Passe Magnético
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {reuniao.escala_passe
                            .sort((a: any, b: any) => a.posicao - b.posicao)
                            .map((ep: any, idx: number) => (
                              <div
                                key={idx}
                                style={{
                                  padding: '0.75rem',
                                  backgroundColor: '#fff',
                                  borderRadius: '0.4rem',
                                  fontSize: '0.9rem',
                                  display: 'grid',
                                  gridTemplateColumns: '60px 1fr',
                                  gap: '1rem',
                                }}
                              >
                                <div style={{ fontWeight: 600 }}>#{ep.posicao}</div>
                                <div>{ep.pessoas?.nome}</div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Evangelização */}
                    {reuniao.escala_evangelizacao && reuniao.escala_evangelizacao.length > 0 && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem', fontWeight: 600, color: '#333' }}>
                          ✝️ Evangelização
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {reuniao.escala_evangelizacao.map((ee: any, idx: number) => (
                            <div
                              key={idx}
                              style={{
                                padding: '0.75rem',
                                backgroundColor: '#fff',
                                borderRadius: '0.4rem',
                                fontSize: '0.9rem',
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 120px',
                                gap: '1rem',
                              }}
                            >
                              <div>{ee.pessoas?.nome}</div>
                              <div>{ee.temas_doutrinarios?.titulo || ee.tema_livre}</div>
                              <div style={{ color: '#666', fontSize: '0.85rem' }}>
                                {ee.turma && `(${ee.turma})`}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Palestras */}
                    {reuniao.escala_palestras && reuniao.escala_palestras.length > 0 && (
                      <div>
                        <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem', fontWeight: 600, color: '#333' }}>
                          🎤 Palestras
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {reuniao.escala_palestras.map((ep: any, idx: number) => (
                            <div
                              key={idx}
                              style={{
                                padding: '0.75rem',
                                backgroundColor: '#fff',
                                borderRadius: '0.4rem',
                                fontSize: '0.9rem',
                                display: 'grid',
                                gridTemplateColumns: '120px 1fr 1fr',
                                gap: '1rem',
                              }}
                            >
                              <div style={{ fontWeight: 600 }}>{ep.expositores?.nome}</div>
                              <div>{ep.temas_doutrinarios?.titulo || ep.tema_livre}</div>
                              <div style={{ color: '#666', fontSize: '0.85rem' }}>
                                {ep.cidade_origem && `${ep.cidade_origem}`}
                                {ep.tipo_palestra && ` (${ep.tipo_palestra})`}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
          <p>Nenhuma escala publicada no momento.</p>
        </div>
      )}
    </div>
  );
}

export default function EscalasPage() {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando escalas...</div>}>
        <EscalasContent />
      </Suspense>
    </div>
  );
}
