import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUsuarioById, updateUsuario, revokeLogin } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Editar Usuário - Admin GEEF',
};

const PERFIS = [
  'administrador',
  'diretoria',
  'secretaria',
  'financeiro',
  'bibliotecario',
  'livraria',
  'evangelizador',
  'coord_juventude',
  'coord_estudos',
  'coord_atendimento',
  'coord_passe',
  'coord_apse',
  'comunicacao',
  'patrimonio',
  'tarefeiro',
  'leitor',
  'voluntario',
  'publico',
];

async function handleUpdate(userId: string, formData: FormData) {
  'use server';

  try {
    await updateUsuario(userId, {
      perfil: (formData.get('perfil') as string) || undefined,
      pode_escalas: formData.get('pode_escalas') === 'on',
      pode_biblioteca: formData.get('pode_biblioteca') === 'on',
      pode_livraria: formData.get('pode_livraria') === 'on',
      pode_financeiro: formData.get('pode_financeiro') === 'on',
      pode_pessoas: formData.get('pode_pessoas') === 'on',
      pode_publicar: formData.get('pode_publicar') === 'on',
      pode_mediunidade: formData.get('pode_mediunidade') === 'on',
      pode_atendimento: formData.get('pode_atendimento') === 'on',
      pode_apse: formData.get('pode_apse') === 'on',
    });

    redirect('/admin/usuarios');
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
}

async function handleRevoke(userId: string) {
  'use server';

  try {
    if (confirm('Tem certeza? Isso removerá o acesso de login desta pessoa.')) {
      await revokeLogin(userId);
      redirect('/admin/usuarios');
    }
  } catch (error) {
    console.error('Erro ao remover login:', error);
    throw error;
  }
}

async function EditUsuarioContent({ id }: { id: string }) {
  const usuario = await getUsuarioById(id);

  return (
    <form action={(formData) => handleUpdate(id, formData)}>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Editar Usuário</h1>
          <p className="admin-page-subtitle">{usuario.pessoas?.nome}</p>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Seção 1: Informações */}
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>👤 Informações</h2>

        <div style={{ padding: '1rem', backgroundColor: 'var(--admin-bg)', borderRadius: '0.6rem', marginBottom: '1.5rem' }}>
          <p style={{ margin: 0, marginBottom: '0.5rem' }}>
            <strong>Pessoa:</strong> {usuario.pessoas?.nome}
          </p>
          <p style={{ margin: 0, marginBottom: '0.5rem' }}>
            <strong>Email:</strong> {usuario.pessoas?.email || '—'}
          </p>
          <p style={{ margin: 0 }}>
            <strong>ID do Usuário:</strong> <code style={{ fontSize: '0.8rem' }}>{id}</code>
          </p>
        </div>

        {/* Seção 2: Perfil e Permissões */}
        <h2 style={{ margin: '2rem 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>🎯 Perfil e Permissões</h2>

        <div className="admin-form-group">
          <label>Perfil do Sistema</label>
          <select
            name="perfil"
            defaultValue={usuario.perfil}
            style={{
              padding: '0.65rem 0.85rem',
              border: '1px solid var(--admin-border)',
              borderRadius: '0.6rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              color: 'var(--text)',
            }}
          >
            {PERFIS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
          Permissões específicas:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" name="pode_escalas" defaultChecked={usuario.pode_escalas} style={{ cursor: 'pointer' }} />
            <span>Escalas</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="pode_biblioteca"
              defaultChecked={usuario.pode_biblioteca}
              style={{ cursor: 'pointer' }}
            />
            <span>Biblioteca</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" name="pode_livraria" defaultChecked={usuario.pode_livraria} style={{ cursor: 'pointer' }} />
            <span>Livraria</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="pode_financeiro"
              defaultChecked={usuario.pode_financeiro}
              style={{ cursor: 'pointer' }}
            />
            <span>Financeiro</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" name="pode_pessoas" defaultChecked={usuario.pode_pessoas} style={{ cursor: 'pointer' }} />
            <span>Pessoas</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" name="pode_publicar" defaultChecked={usuario.pode_publicar} style={{ cursor: 'pointer' }} />
            <span>Publicar</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="pode_mediunidade"
              defaultChecked={usuario.pode_mediunidade}
              style={{ cursor: 'pointer' }}
            />
            <span>Mediunidade</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="pode_atendimento"
              defaultChecked={usuario.pode_atendimento}
              style={{ cursor: 'pointer' }}
            />
            <span>Atendimento</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" name="pode_apse" defaultChecked={usuario.pode_apse} style={{ cursor: 'pointer' }} />
            <span>APSE</span>
          </label>
        </div>

        {/* Botões */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button type="submit" className="admin-btn admin-btn-primary">
            ✅ Salvar
          </button>
          <Link href="/admin/usuarios" className="admin-btn admin-btn-secondary">
            ❌ Cancelar
          </Link>
          <form action={() => handleRevoke(id)} style={{ marginLeft: 'auto' }}>
            <button
              type="submit"
              className="admin-btn"
              style={{
                backgroundColor: 'rgba(200, 0, 0, 0.15)',
                color: '#c00',
                border: '1px solid rgba(200, 0, 0, 0.3)',
              }}
            >
              🔓 Revogar Acesso
            </button>
          </form>
        </div>
      </div>
    </form>
  );
}

export default function EditUsuarioPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <EditUsuarioContent id={params.id} />
    </Suspense>
  );
}
