import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getPessoasSemLogin, grantLogin } from '../actions';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Novo Usuário - Admin GEEF',
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
  'tarafeiro',
  'leitor',
  'voluntario',
  'publico',
];

async function handleSubmit(formData: FormData) {
  'use server';

  try {
    const pessoaId = formData.get('pessoa_id') as string;
    const perfil = formData.get('perfil') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Create auth user
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) throw authError;

    const userId = authData.user.id;

    // Create usuario_sistema record
    const permissoes = {
      pode_escalas: formData.get('pode_escalas') === 'on',
      pode_biblioteca: formData.get('pode_biblioteca') === 'on',
      pode_livraria: formData.get('pode_livraria') === 'on',
      pode_financeiro: formData.get('pode_financeiro') === 'on',
      pode_pessoas: formData.get('pode_pessoas') === 'on',
      pode_publicar: formData.get('pode_publicar') === 'on',
      pode_mediunidade: formData.get('pode_mediunidade') === 'on',
      pode_atendimento: formData.get('pode_atendimento') === 'on',
      pode_apse: formData.get('pode_apse') === 'on',
    };

    await grantLogin(userId, pessoaId, perfil, permissoes);

    redirect('/admin/usuarios');
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
}

export default async function NovoUsuarioPage() {
  const pessoasSemLogin = await getPessoasSemLogin();

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Novo Usuário</h1>
          <p className="admin-page-subtitle">Criar login para uma pessoa</p>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {pessoasSemLogin.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
            <p>Todas as pessoas já possuem login.</p>
            <Link href="/admin/usuarios" className="admin-btn admin-btn-secondary" style={{ marginTop: '1rem' }}>
              ← Voltar
            </Link>
          </div>
        ) : (
          <form action={handleSubmit}>
            {/* Seção 1: Pessoa */}
            <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>👤 Pessoa</h2>

            <div className="admin-form-group">
              <label>Selecione a Pessoa *</label>
              <select name="pessoa_id" required style={{
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.6rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text)',
              }}>
                <option value="">— Selecione uma pessoa —</option>
                {pessoasSemLogin.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} ({p.email || 'sem email'})
                  </option>
                ))}
              </select>
            </div>

            {/* Seção 2: Credenciais */}
            <h2 style={{ margin: '2rem 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>🔐 Credenciais</h2>

            <div className="admin-form-group">
              <label>Email (login) *</label>
              <input type="email" name="email" required />
            </div>

            <div className="admin-form-group">
              <label>Senha *</label>
              <input type="password" name="password" required minLength={8} />
            </div>

            {/* Seção 3: Perfil e Permissões */}
            <h2 style={{ margin: '2rem 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>🎯 Perfil e Permissões</h2>

            <div className="admin-form-group">
              <label>Perfil do Sistema *</label>
              <select name="perfil" required style={{
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--admin-border)',
                borderRadius: '0.6rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--text)',
              }}>
                <option value="">— Selecione um perfil —</option>
                {PERFIS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
              Selecione as permissões específicas para este usuário:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" name="pode_escalas" style={{ cursor: 'pointer' }} />
                <span>Escalas</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" name="pode_biblioteca" style={{ cursor: 'pointer' }} />
                <span>Biblioteca</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" name="pode_livraria" style={{ cursor: 'pointer' }} />
                <span>Livraria</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" name="pode_financeiro" style={{ cursor: 'pointer' }} />
                <span>Financeiro</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" name="pode_pessoas" style={{ cursor: 'pointer' }} />
                <span>Pessoas</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" name="pode_publicar" style={{ cursor: 'pointer' }} />
                <span>Publicar</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" name="pode_mediunidade" style={{ cursor: 'pointer' }} />
                <span>Mediunidade</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" name="pode_atendimento" style={{ cursor: 'pointer' }} />
                <span>Atendimento</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" name="pode_apse" style={{ cursor: 'pointer' }} />
                <span>APSE</span>
              </label>
            </div>

            {/* Botões */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="submit" className="admin-btn admin-btn-primary">
                ✅ Criar Usuário
              </button>
              <Link href="/admin/usuarios" className="admin-btn admin-btn-secondary">
                ❌ Cancelar
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
