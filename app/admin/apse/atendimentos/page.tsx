import { getAtendimentos } from '../actions';
import { Suspense } from 'react';

type AtendimentoApse = Awaited<ReturnType<typeof getAtendimentos>>[number];

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
          <div className="overflow-x-auto">
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
                {atendimentos.map((atend: AtendimentoApse) => (
                  <tr key={atend.id}>
                    <td className="text-sm-500">
                      {new Date(atend.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="text-sm-500">
                      {atend.tipo === 'visita' && '🏠'}
                      {atend.tipo === 'campanha' && '📢'}
                      {atend.tipo === 'cesta' && '🎁'}
                      {atend.tipo === 'encaminhamento' && '➡️'}
                      {' '}{atend.tipo}
                    </td>
                    <td className="text-sm-muted">
                      {atend.familia?.responsavel_id ? 'Registrada' : '—'}
                    </td>
                    <td className="text-sm-muted">
                      {atend.pessoa?.nome}
                    </td>
                    <td className="text-xs-muted">
                      {atend.responsavel?.nome}
                    </td>
                    <td className="text-xs-muted">
                      {atend.descricao || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center-muted">Nenhum atendimento registrado.</p>
        )}
      </div>
    </div>
  );
}

export default function AtendimentosPage() {
  return (
    <Suspense fallback={<div className="suspense-center">Carregando...</div>}>
      <AtendimentosContent />
    </Suspense>
  );
}
