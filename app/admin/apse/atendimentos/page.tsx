import Link from 'next/link';
import { getAtendimentos } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Atendimentos APSE - Admin GEEF',
};

async function AtendimentosContent() {
  const atendimentos = await getAtendimentos();

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Atendimentos APSE</h1>
          <p className="admin-page-subtitle">Registro de atendimentos realizados</p>
        </div>
      </div>

      <div className="admin-card">
        {atendimentos.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Família</th>
                  <th>Pessoa</th>
                  <th>Responsável</th>
                  <th>Descrição</th>
                </tr>
              </thead>
              <tbody>
                {atendimentos.map((atend: any) => (
                  <tr key={atend.id}>
                    <td style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                      {new Date(atend.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{ fontWeight: 500 }}>
                      {atend.tipo === 'visita' && '🏠'}
                      {atend.tipo === 'campanha' && '📢'}
                      {atend.tipo === 'cesta' && '🎁'}
                      {atend.tipo === 'encaminhamento' && '➡️'}
                      {' '}{atend.tipo}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {atend.familia?.responsavel_id ? 'Registrada' : '—'}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>
                      {atend.pessoa?.nome}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                      {atend.responsavel?.nome}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {atend.descricao || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Nenhum atendimento registrado.</p>
        )}
      </div>
    </div>
  );
}

export default function AtendimentosPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <AtendimentosContent />
    </Suspense>
  );
}
