import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getPessoaById, updatePessoa, addVinculo, removeVinculo, togglePessoaStatus } from '../actions';
import { Suspense } from 'react';

export const metadata = {
  title: 'Editar Pessoa - Admin GEEF',
};

const TIPOS_VINCULO = [
  'frequentador',
  'tarefeiro',
  'voluntario',
  'evangelizador',
  'crianca',
  'jovem',
  'responsavel_legal',
  'leitor',
  'comprador',
  'doador',
  'assistido',
  'palestrante',
  'dirigente',
  'membro_departamento',
  'visitante',
];

async function handleUpdatePessoa(pessoaId: string, formData: FormData) {
  'use server';

  try {
    await updatePessoa(pessoaId, {
      nome: formData.get('nome') as string,
      nome_social: (formData.get('nome_social') as string) || undefined,
      email: (formData.get('email') as string) || undefined,
      telefone: (formData.get('telefone') as string) || undefined,
      whatsapp: (formData.get('whatsapp') as string) || undefined,
      data_nascimento: (formData.get('data_nascimento') as string) || undefined,
      cpf: (formData.get('cpf') as string) || undefined,
      rg: (formData.get('rg') as string) || undefined,
      logradouro: (formData.get('logradouro') as string) || undefined,
      numero: (formData.get('numero') as string) || undefined,
      bairro: (formData.get('bairro') as string) || undefined,
      cidade: (formData.get('cidade') as string) || undefined,
      estado: (formData.get('estado') as string) || undefined,
      cep: (formData.get('cep') as string) || undefined,
      observacoes: (formData.get('observacoes') as string) || undefined,
      contato_emergencia: (formData.get('contato_emergencia') as string) || undefined,
      autoriza_notificacao: formData.get('autoriza_notificacao') === 'on',
      autoriza_imagem_voz: formData.get('autoriza_imagem_voz') === 'on',
    });

    // Handle status change
    const novoStatus = formData.get('status') as string;
    if (novoStatus) {
      await togglePessoaStatus(pessoaId, novoStatus as any);
    }

    // Handle vínculo changes
    const { vinculos: vinculosAtuais } = await getPessoaById(pessoaId);
    const vinculosAtualSet = new Set(vinculosAtuais.map((v: any) => v.vinculo));
    const vinculosNovoSet = new Set(TIPOS_VINCULO.filter((v) => formData.get(`vinculo_${v}`) === 'on'));

    // Remove vínculos não mais selecionados
    for (const vinculoRemover of vinculosAtualSet) {
      if (!vinculosNovoSet.has(vinculoRemover)) {
        await removeVinculo(pessoaId, vinculoRemover as any);
      }
    }

    // Add novos vínculos
    for (const vinculoAdicionar of vinculosNovoSet) {
      if (!vinculosAtualSet.has(vinculoAdicionar)) {
        await addVinculo(pessoaId, vinculoAdicionar as any);
      }
    }

    redirect('/admin/pessoas');
  } catch (error) {
    console.error('Erro ao atualizar pessoa:', error);
    throw error;
  }
}

async function EditPessoaContent({ id }: { id: string }) {
  const { pessoa, vinculos } = await getPessoaById(id);

  const vinculosSet = new Set(vinculos.map((v: any) => v.vinculo));

  return (
    <form action={(formData) => handleUpdatePessoa(id, formData)}>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Editar Pessoa</h1>
          <p className="admin-page-subtitle">{pessoa.nome}</p>
        </div>
      </div>

      {/* Form */}
      <div className="admin-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Seção 1: Identificação */}
        <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>📋 Identificação</h2>

        <div className="admin-form-group">
          <label>Nome Completo *</label>
          <input type="text" name="nome" defaultValue={pessoa.nome} required />
        </div>

        <div className="admin-form-group">
          <label>Nome Social</label>
          <input type="text" name="nome_social" defaultValue={pessoa.nome_social || ''} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div className="admin-form-group">
            <label>CPF</label>
            <input type="text" name="cpf" defaultValue={pessoa.cpf || ''} />
          </div>
          <div className="admin-form-group">
            <label>RG</label>
            <input type="text" name="rg" defaultValue={pessoa.rg || ''} />
          </div>
        </div>

        <div className="admin-form-group">
          <label>Data de Nascimento</label>
          <input type="date" name="data_nascimento" defaultValue={pessoa.data_nascimento || ''} />
        </div>

        <div className="admin-form-group">
          <label>Status</label>
          <select
            name="status"
            defaultValue={pessoa.status}
            style={{
              padding: '0.65rem 0.85rem',
              border: '1px solid var(--admin-border)',
              borderRadius: '0.6rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              color: 'var(--text)',
            }}
          >
            <option value="ativo">✅ Ativo</option>
            <option value="inativo">⏸️ Inativo</option>
            <option value="afastado">⏳ Afastado</option>
            <option value="falecido">† Falecido</option>
          </select>
        </div>

        {/* Seção 2: Contato */}
        <h2 style={{ margin: '2rem 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>📞 Contato</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div className="admin-form-group">
            <label>Telefone</label>
            <input type="tel" name="telefone" defaultValue={pessoa.telefone || ''} />
          </div>
          <div className="admin-form-group">
            <label>WhatsApp</label>
            <input type="tel" name="whatsapp" defaultValue={pessoa.whatsapp || ''} />
          </div>
        </div>

        <div className="admin-form-group">
          <label>Email</label>
          <input type="email" name="email" defaultValue={pessoa.email || ''} />
        </div>

        <div className="admin-form-group">
          <label>Contato de Emergência</label>
          <input type="text" name="contato_emergencia" defaultValue={pessoa.contato_emergencia || ''} />
        </div>

        {/* Seção 3: Endereço */}
        <h2 style={{ margin: '2rem 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>🏠 Endereço</h2>

        <div className="admin-form-group">
          <label>Logradouro</label>
          <input type="text" name="logradouro" defaultValue={pessoa.logradouro || ''} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div className="admin-form-group">
            <label>Bairro</label>
            <input type="text" name="bairro" defaultValue={pessoa.bairro || ''} />
          </div>
          <div className="admin-form-group">
            <label>Número</label>
            <input type="text" name="numero" defaultValue={pessoa.numero || ''} />
          </div>
          <div className="admin-form-group">
            <label>Complemento</label>
            <input type="text" name="complemento" defaultValue={pessoa.complemento || ''} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div className="admin-form-group">
            <label>Cidade</label>
            <input type="text" name="cidade" defaultValue={pessoa.cidade || ''} />
          </div>
          <div className="admin-form-group">
            <label>Estado</label>
            <input type="text" name="estado" defaultValue={pessoa.estado || ''} maxLength={2} />
          </div>
          <div className="admin-form-group">
            <label>CEP</label>
            <input type="text" name="cep" defaultValue={pessoa.cep || ''} />
          </div>
        </div>

        {/* Seção 4: Vínculos */}
        <h2 style={{ margin: '2rem 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>🔗 Vínculos</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          {TIPOS_VINCULO.map((vinculo) => (
            <label key={vinculo} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name={`vinculo_${vinculo}`}
                defaultChecked={vinculosSet.has(vinculo)}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.9rem' }}>{vinculo}</span>
            </label>
          ))}
        </div>

        {/* Seção 5: Observações e Permissões */}
        <h2 style={{ margin: '2rem 0 1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>⚙️ Configurações</h2>

        <div className="admin-form-group">
          <label>Observações</label>
          <textarea
            name="observacoes"
            defaultValue={pessoa.observacoes || ''}
            rows={4}
            style={{
              padding: '0.65rem 0.85rem',
              border: '1px solid var(--admin-border)',
              borderRadius: '0.6rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              color: 'var(--text)',
              resize: 'vertical',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="autoriza_notificacao"
              defaultChecked={pessoa.autoriza_notificacao}
              style={{ cursor: 'pointer' }}
            />
            <span>Autoriza notificações</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="autoriza_imagem_voz"
              defaultChecked={pessoa.autoriza_imagem_voz}
              style={{ cursor: 'pointer' }}
            />
            <span>Autoriza uso de imagem/voz</span>
          </label>
        </div>

        {/* Botões */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button type="submit" className="admin-btn admin-btn-primary">
            ✅ Salvar
          </button>
          <Link href="/admin/pessoas" className="admin-btn admin-btn-secondary">
            ❌ Cancelar
          </Link>
        </div>
      </div>
    </form>
  );
}

export default function EditPessoaPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <EditPessoaContent id={params.id} />
    </Suspense>
  );
}
