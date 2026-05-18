import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Suspense } from 'react';
import { buildFlashNoticeUrl } from '@/lib/notificacoes/flash-notice';
import {
  addContaBancaria,
  addContato,
  getContatoTipos,
  deleteContaBancaria,
  deleteContato,
  getContasBancarias,
  getContatos,
  getEnderecos,
  getInstituicao,
  getPessoasDisponiveis,
  updateEndereco,
  updateInstituicao,
} from '../actions';
import { DescritivoField } from '@/components/admin/instituicao-descritivo-fields';
import { InstituicaoContatoFields, InstituicaoContatoTipoManager } from '@/components/admin/instituicao-contatos-fields';
import { LogoUploadForm } from '@/components/admin/logo-upload-form';
import { contentPages, site } from '@/lib/site-data';

export const metadata = {
  title: 'Editar Instituição - Admin GEEF',
};

const INSTITUICAO_STEPS = [
  { key: 'identificacao', label: 'Identificação' },
  { key: 'endereco', label: 'Endereço' },
  { key: 'descritivo', label: 'Descritivo' },
  { key: 'valores', label: 'Missão e valores' },
  { key: 'documentos', label: 'Documentos' },
  { key: 'contatos', label: 'Contatos' },
  { key: 'contas', label: 'Contas' },
] as const;

type InstituicaoStep = (typeof INSTITUICAO_STEPS)[number]['key'];
const QUEM_SOMOS = contentPages['quem-somos'];

const FALLBACK_INSTITUICAO = {
  nome_oficial: site.name,
  nome_curto: site.shortName,
  cnpj: undefined as string | undefined,
  natureza_juridica: undefined as string | undefined,
  data_fundacao: undefined as string | undefined,
  logo_url: undefined as string | undefined,
  descricao: QUEM_SOMOS?.intro,
  historia: QUEM_SOMOS?.sections.find((section) => section.heading === 'Nossa história')?.text,
  missao: QUEM_SOMOS?.sections.find((section) => section.heading === 'Nossa missão')?.text,
  visao: QUEM_SOMOS?.sections.find((section) => section.heading === 'Como trabalhamos')?.text,
  valores:
    QUEM_SOMOS?.sections
      .find((section) => section.heading === 'Nossos valores')
      ?.bullets?.join('\n') ?? QUEM_SOMOS?.sections.find((section) => section.heading === 'Nossos valores')?.text,
  estatuto_url: undefined as string | undefined,
};

const FALLBACK_ENDERECO = {
  cep: undefined as string | undefined,
  logradouro: 'Rua Gwyer de Azevedo',
  numero: '35',
  complemento: undefined as string | undefined,
  bairro: 'Centro',
  cidade: 'Santa Maria Madalena',
  estado: 'RJ',
  maps_link: undefined as string | undefined,
  latitude: undefined as number | undefined,
  longitude: undefined as number | undefined,
};

function isInstituicaoStep(value: unknown): value is InstituicaoStep {
  return typeof value === 'string' && INSTITUICAO_STEPS.some((step) => step.key === value);
}

function buildHref(step: InstituicaoStep) {
  const params = new URLSearchParams();
  params.set('tab', step);
  return `/admin/instituicao/editar?${params.toString()}`;
}

function textValue(formData: FormData, name: string) {
  const value = formData.get(name);
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeCnpj(value: string | undefined) {
  return value?.replace(/\D/g, '').slice(0, 14) || undefined;
}

function formatCnpj(value: string | undefined) {
  const digits = value?.replace(/\D/g, '') || '';
  if (digits.length !== 14) {
    return value || '';
  }

  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

function normalizeDateInput(value: string | undefined) {
  return value ? value.slice(0, 10) : '';
}

function resolveNomeOficial(instituicaoAtual: typeof FALLBACK_INSTITUICAO | null, formData: FormData) {
  return textValue(formData, 'nome_oficial') || instituicaoAtual?.nome_oficial || FALLBACK_INSTITUICAO.nome_oficial;
}

function buildInstituicaoPatch(instituicaoAtual: typeof FALLBACK_INSTITUICAO | null, formData: FormData, step: InstituicaoStep) {
  const nomeOficial = resolveNomeOficial(instituicaoAtual, formData);

  if (step === 'identificacao') {
    return {
      nome_oficial: nomeOficial,
      nome_curto: textValue(formData, 'nome_curto'),
      cnpj: normalizeCnpj(textValue(formData, 'cnpj')),
      natureza_juridica: textValue(formData, 'natureza_juridica'),
      data_fundacao: textValue(formData, 'data_fundacao'),
    };
  }

  if (step === 'descritivo') {
    return {
      nome_oficial: nomeOficial,
      descricao: textValue(formData, 'descricao'),
      historia: textValue(formData, 'historia'),
    };
  }

  if (step === 'valores') {
    return {
      nome_oficial: nomeOficial,
      missao: textValue(formData, 'missao'),
      visao: textValue(formData, 'visao'),
      valores: textValue(formData, 'valores'),
    };
  }

  return {
    nome_oficial: nomeOficial,
    logo_url: textValue(formData, 'logo_url'),
    estatuto_url: textValue(formData, 'estatuto_url'),
  };
}

function buildEnderecoSnapshot(enderecoAtual: typeof FALLBACK_ENDERECO | null, formData: FormData) {
  const base = enderecoAtual ?? FALLBACK_ENDERECO;
  return {
    cep: textValue(formData, 'cep') || base.cep,
    logradouro: textValue(formData, 'logradouro') || base.logradouro,
    numero: textValue(formData, 'numero') || base.numero,
    complemento: textValue(formData, 'complemento') || base.complemento,
    bairro: textValue(formData, 'bairro') || base.bairro,
    cidade: textValue(formData, 'cidade') || base.cidade,
    estado: textValue(formData, 'estado') || base.estado,
    maps_link: textValue(formData, 'maps_link') || base.maps_link,
    latitude: base.latitude,
    longitude: base.longitude,
  };
}

function InfoHint({ label, title }: { label: string; title: string }) {
  return (
    <button
      type="button"
      className="admin-info-hint"
      aria-label={label}
      title={title}
    >
      i
    </button>
  );
}

function TabHeaderAction({ activeStep }: { activeStep: InstituicaoStep }) {
  const formByStep: Record<InstituicaoStep, string> = {
    identificacao: 'instituicao-step-form',
    endereco: 'instituicao-step-form',
    descritivo: 'instituicao-step-form',
    valores: 'instituicao-step-form',
    documentos: 'instituicao-step-form',
    contatos: 'contatos-step-form',
    contas: 'contas-step-form',
  };

  return (
    <>
      <button type="submit" form={formByStep[activeStep]} className="admin-btn admin-btn-primary">
        Salvar
      </button>
      <Link href="/admin/instituicao" className="admin-btn admin-btn-secondary">
        Cancelar
      </Link>
    </>
  );
}

async function handleAddContato(formData: FormData) {
  'use server';

  const result = await addContato({
    tipo: (formData.get('tipo') as string) || 'Contato',
    telefone: (formData.get('telefone') as string) || undefined,
    whatsapp: (formData.get('whatsapp') as string) || undefined,
    email: (formData.get('email') as string) || undefined,
    instagram: (formData.get('instagram') as string) || undefined,
    facebook: (formData.get('facebook') as string) || undefined,
    youtube: (formData.get('youtube') as string) || undefined,
    site: (formData.get('site') as string) || undefined,
    responsavel_id: (formData.get('responsavel_id') as string) || undefined,
  });

  if (!result.success) {
    redirect(
      buildFlashNoticeUrl('/admin/instituicao/editar?tab=contatos', {
        variant: 'error',
        message: result.error ? `Não foi possível salvar o contato: ${result.error}` : 'Não foi possível salvar o contato.',
      })
    );
  }

  revalidatePath('/admin/instituicao');
  revalidatePath('/admin/instituicao/editar');
  redirect(buildFlashNoticeUrl('/admin/instituicao/editar?tab=contatos', { variant: 'success', message: 'Contato salvo.' }));
}

async function handleDeleteContato(formData: FormData) {
  'use server';

  const id = formData.get('id');
  if (typeof id === 'string' && id) {
    const result = await deleteContato(id);
    if (!result.success) {
      redirect(buildFlashNoticeUrl('/admin/instituicao/editar?tab=contatos', { variant: 'error', message: 'Não foi possível remover o contato.' }));
    }
  }

  revalidatePath('/admin/instituicao');
  revalidatePath('/admin/instituicao/editar');
  redirect(buildFlashNoticeUrl('/admin/instituicao/editar?tab=contatos', { variant: 'success', message: 'Contato removido.' }));
}

async function handleAddConta(formData: FormData) {
  'use server';

  const result = await addContaBancaria({
    nome: (formData.get('nome') as string) || 'Conta bancária',
    banco: (formData.get('banco') as string) || undefined,
    agencia: (formData.get('agencia') as string) || undefined,
    conta: (formData.get('conta') as string) || undefined,
    tipo_conta: (formData.get('tipo_conta') as string) || undefined,
    titular: (formData.get('titular') as string) || undefined,
    cpf_cnpj_titular: (formData.get('cpf_cnpj_titular') as string) || undefined,
    chave_pix: (formData.get('chave_pix') as string) || undefined,
    tipo_chave_pix: (formData.get('tipo_chave_pix') as string) || undefined,
    finalidade: (formData.get('finalidade') as string) || undefined,
    visibilidade: (formData.get('visibilidade') as string) || undefined,
  });

  if (!result.success) {
    redirect(buildFlashNoticeUrl('/admin/instituicao/editar?tab=contas', { variant: 'error', message: 'Não foi possível salvar a conta.' }));
  }

  revalidatePath('/admin/instituicao');
  revalidatePath('/admin/instituicao/editar');
  redirect(buildFlashNoticeUrl('/admin/instituicao/editar?tab=contas', { variant: 'success', message: 'Conta salva.' }));
}

async function handleDeleteConta(formData: FormData) {
  'use server';

  const id = formData.get('id');
  if (typeof id === 'string' && id) {
    const result = await deleteContaBancaria(id);
    if (!result.success) {
      redirect(buildFlashNoticeUrl('/admin/instituicao/editar?tab=contas', { variant: 'error', message: 'Não foi possível remover a conta.' }));
    }
  }

  revalidatePath('/admin/instituicao');
  revalidatePath('/admin/instituicao/editar');
  redirect(buildFlashNoticeUrl('/admin/instituicao/editar?tab=contas', { variant: 'success', message: 'Conta removida.' }));
}

async function saveInstituicaoStep(formData: FormData) {
  'use server';

  const step = isInstituicaoStep(formData.get('step')) ? (formData.get('step') as InstituicaoStep) : 'identificacao';
  const instituicaoAtual = await getInstituicao();
  const enderecosAtuais = await getEnderecos();
  const enderecoAtual = enderecosAtuais[0] || null;
  const patch = buildInstituicaoPatch(instituicaoAtual, formData, step);
  const enderecoSnapshot = buildEnderecoSnapshot(enderecoAtual, formData);

  if (step === 'identificacao') {
    const nomeOficial = patch.nome_oficial;
    if (!nomeOficial) {
      redirect(buildFlashNoticeUrl(`/admin/instituicao/editar?tab=${step}`, { variant: 'error', message: 'Nome oficial é obrigatório.' }));
    }

    const result = await updateInstituicao(patch);

    if (!result.success) {
      redirect(
        buildFlashNoticeUrl(`/admin/instituicao/editar?tab=${step}`, {
          variant: 'error',
          message: result.error ? `Não foi possível salvar a instituição: ${result.error}` : 'Não foi possível salvar a instituição.',
        })
      );
    }

    revalidatePath('/admin/instituicao');
    revalidatePath('/admin/instituicao/editar');
    redirect(buildFlashNoticeUrl('/admin/instituicao', { variant: 'success', message: 'Instituição salva.' }));
  }

  if (step === 'endereco') {
    const result = await updateEndereco(enderecoSnapshot);

    if (!result?.success) {
      redirect(buildFlashNoticeUrl(`/admin/instituicao/editar?tab=${step}`, { variant: 'error', message: 'Não foi possível salvar o endereço.' }));
    }

    revalidatePath('/admin/instituicao');
    revalidatePath('/admin/instituicao/editar');
    redirect(buildFlashNoticeUrl('/admin/instituicao', { variant: 'success', message: 'Endereço salvo.' }));
  }

  if (step === 'descritivo') {
    const result = await updateInstituicao(patch);

    if (!result.success) {
      redirect(
        buildFlashNoticeUrl(`/admin/instituicao/editar?tab=${step}`, {
          variant: 'error',
          message: result.error ? `Não foi possível salvar a descrição: ${result.error}` : 'Não foi possível salvar a descrição.',
        })
      );
    }

    revalidatePath('/admin/instituicao');
    revalidatePath('/admin/instituicao/editar');
    redirect(buildFlashNoticeUrl('/admin/instituicao', { variant: 'success', message: 'Descrição salva.' }));
  }

  if (step === 'valores') {
    const result = await updateInstituicao(patch);

    if (!result.success) {
      redirect(
        buildFlashNoticeUrl(`/admin/instituicao/editar?tab=${step}`, {
          variant: 'error',
          message: result.error ? `Não foi possível salvar as informações: ${result.error}` : 'Não foi possível salvar as informações.',
        })
      );
    }

    revalidatePath('/admin/instituicao');
    revalidatePath('/admin/instituicao/editar');
    redirect(buildFlashNoticeUrl('/admin/instituicao', { variant: 'success', message: 'Informações salvas.' }));
  }

  if (step === 'documentos') {
    const result = await updateInstituicao(patch);

    if (!result.success) {
      redirect(
        buildFlashNoticeUrl(`/admin/instituicao/editar?tab=${step}`, {
          variant: 'error',
          message: result.error ? `Não foi possível salvar os documentos: ${result.error}` : 'Não foi possível salvar os documentos.',
        })
      );
    }

    revalidatePath('/admin/instituicao');
    revalidatePath('/admin/instituicao/editar');
    redirect(buildFlashNoticeUrl('/admin/instituicao', { variant: 'success', message: 'Documentos salvos.' }));
  }
}

async function EditInstituicaoContent({ searchParams }: { searchParams: { tab?: string } }) {
  const instituicao = await getInstituicao();
  const enderecos = await getEnderecos();
  const contatos = await getContatos();
  const contas = await getContasBancarias();
  const pessoas = await getPessoasDisponiveis();
  const tiposContato = await getContatoTipos();
  const endereco = enderecos[0];
  const instituicaoBase = instituicao ?? FALLBACK_INSTITUICAO;
  const enderecoBase = endereco ?? FALLBACK_ENDERECO;

  const requestedStep = isInstituicaoStep(searchParams.tab) ? searchParams.tab : 'identificacao';
  const activeStep = requestedStep;
  const renderTabLink = (step: InstituicaoStep) => {
    const isActive = activeStep === step;
    const className = `admin-step-tab ${isActive ? 'active' : ''}`;
    const label = INSTITUICAO_STEPS.find((item) => item.key === step)?.label ?? step;

    return (
      <Link key={step} href={buildHref(step)} className={className}>
        {label}
      </Link>
    );
  };

  return (
    <div className="area-page">
      <div className="admin-page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 className="admin-page-title">Editar Instituição</h1>
            <InfoHint label="Informação sobre o cadastro único" title="Há apenas uma instituição. O nome oficial pode ser alterado, não removido." />
          </div>
        </div>
        <div className="admin-actions">
          <TabHeaderAction activeStep={activeStep} />
        </div>
      </div>

      <nav className="admin-step-tabs" aria-label="Etapas do cadastro da instituição">
        {INSTITUICAO_STEPS.map((step) => renderTabLink(step.key))}
      </nav>

      <section className="area-section">
        <div className="admin-card admin-step-card">
          <form id="instituicao-step-form" action={saveInstituicaoStep}>
            <input type="hidden" name="step" value={activeStep} />
            {activeStep !== 'identificacao' ? (
              <input type="hidden" name="nome_oficial" value={instituicaoBase.nome_oficial || FALLBACK_INSTITUICAO.nome_oficial} />
            ) : null}

            {activeStep === 'identificacao' && (
              <div className="module-grid">
                <label className="profile-form-field" style={{ gridColumn: '1 / -1' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    Nome oficial *
                    <InfoHint label="Informação do nome oficial" title="O nome oficial não pode ser apagado. Se ficar em branco, o valor atual é mantido." />
                  </span>
                  <input
                    type="text"
                    name="nome_oficial"
                    required
                    minLength={3}
                    defaultValue={instituicaoBase.nome_oficial || ''}
                    className="profile-form-input"
                  />
                </label>
                <label className="profile-form-field">
                  <span>Nome curto</span>
                  <input type="text" name="nome_curto" defaultValue={instituicaoBase.nome_curto || ''} className="profile-form-input" />
                </label>
                <label className="profile-form-field">
                  <span>CNPJ</span>
                  <input
                    type="text"
                    name="cnpj"
                    placeholder="00.000.000/0000-00"
                    defaultValue={formatCnpj(instituicaoBase.cnpj) || ''}
                    className="profile-form-input"
                  />
                </label>
                <label className="profile-form-field">
                  <span>Data de fundação</span>
                  <input type="date" name="data_fundacao" defaultValue={normalizeDateInput(instituicaoBase.data_fundacao)} className="profile-form-input" />
                </label>
                <label className="profile-form-field" style={{ gridColumn: '1 / -1' }}>
                  <span>Natureza jurídica</span>
                  <input
                    type="text"
                    name="natureza_juridica"
                    placeholder="Ex: Associação Civil Sem Fins Lucrativos"
                    defaultValue={instituicaoBase.natureza_juridica || ''}
                    className="profile-form-input"
                  />
                </label>
              </div>
            )}

            {activeStep === 'endereco' && (
              <div className="module-grid">
                <label className="profile-form-field" style={{ gridColumn: '1 / -1' }}>
                  <span>Logradouro</span>
                  <input type="text" name="logradouro" defaultValue={enderecoBase.logradouro || ''} className="profile-form-input" />
                </label>
                <label className="profile-form-field">
                  <span>Número</span>
                  <input type="text" name="numero" defaultValue={enderecoBase.numero || ''} className="profile-form-input" />
                </label>
                <label className="profile-form-field">
                  <span>Complemento</span>
                  <input type="text" name="complemento" defaultValue={enderecoBase.complemento || ''} className="profile-form-input" />
                </label>
                <label className="profile-form-field">
                  <span>Bairro</span>
                  <input type="text" name="bairro" defaultValue={enderecoBase.bairro || ''} className="profile-form-input" />
                </label>
                <label className="profile-form-field">
                  <span>Cidade</span>
                  <input type="text" name="cidade" defaultValue={enderecoBase.cidade || ''} className="profile-form-input" />
                </label>
                <label className="profile-form-field">
                  <span>Estado</span>
                  <input type="text" name="estado" maxLength={2} defaultValue={enderecoBase.estado || ''} className="profile-form-input" />
                </label>
                <label className="profile-form-field">
                  <span>CEP</span>
                  <input type="text" name="cep" placeholder="00000-000" defaultValue={enderecoBase.cep || ''} className="profile-form-input" />
                </label>
                <label className="profile-form-field" style={{ gridColumn: '1 / -1' }}>
                  <span>Link Google Maps</span>
                  <input type="url" name="maps_link" defaultValue={enderecoBase.maps_link || ''} className="profile-form-input" />
                </label>
              </div>
            )}

            {activeStep === 'descritivo' && (
              <div className="module-grid">
                <DescritivoField
                  name="descricao"
                  label="Descrição breve"
                  defaultValue={instituicaoBase.descricao || ''}
                  rows={4}
                  recommendedLength={280}
                  placeholder="Resumo objetivo da instituição."
                />
                <DescritivoField
                  name="historia"
                  label="História"
                  defaultValue={instituicaoBase.historia || ''}
                  rows={6}
                  recommendedLength={1200}
                  placeholder="Conte a origem, a trajetória e os marcos principais."
                />
              </div>
            )}

            {activeStep === 'valores' && (
              <div className="module-grid">
                <DescritivoField
                  name="missao"
                  label="Missão"
                  defaultValue={instituicaoBase.missao || ''}
                  rows={4}
                  recommendedLength={280}
                  placeholder="Qual é o propósito da instituição?"
                />
                <DescritivoField
                  name="visao"
                  label="Visão"
                  defaultValue={instituicaoBase.visao || ''}
                  rows={4}
                  recommendedLength={280}
                  placeholder="Onde a instituição quer chegar?"
                />
                <DescritivoField
                  name="valores"
                  label="Valores"
                  defaultValue={instituicaoBase.valores || ''}
                  rows={4}
                  recommendedLength={500}
                  placeholder="Liste os princípios que orientam o trabalho."
                />
              </div>
            )}

            {activeStep === 'documentos' && (
              <div className="module-grid">
                <div style={{ gridColumn: '1 / -1' }}>
                  <label>
                    <span style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Logo</span>
                  </label>
                  <LogoUploadForm currentLogo={instituicaoBase.logo_url || ''} />
                </div>
                <input type="hidden" name="logo_url" value={instituicaoBase.logo_url || ''} />
                <label className="profile-form-field" style={{ gridColumn: '1 / -1' }}>
                  <span>Estatuto (URL do PDF)</span>
                  <input type="url" name="estatuto_url" defaultValue={instituicaoBase.estatuto_url || ''} className="profile-form-input" />
                </label>
              </div>
            )}
          </form>

            {activeStep === 'contatos' && (
              <div className="module-grid">
                <div className="area-panel-item" style={{ gridColumn: '1 / -1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <strong>Contatos</strong>
                    <InfoHint label="Ajuda sobre contatos" title="Contatos oficiais da instituição. Um ou mais canais podem ser cadastrados aqui." />
                  </div>

                  {contatos.length > 0 ? (
                    <div className="module-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
                      {contatos.map((contato: any) => (
                        <div key={contato.id} className="area-panel-item">
                          <strong>{contato.tipo || 'Contato'}</strong>
                          <p style={{ marginTop: '0.5rem' }}>
                            {contato.telefone && <>☎️ {contato.telefone}<br /></>}
                            {contato.whatsapp && <>💬 {contato.whatsapp}<br /></>}
                            {contato.email && <>📧 {contato.email}<br /></>}
                            {contato.site && <>🌐 {contato.site}<br /></>}
                            {contato.instagram && <>📸 {contato.instagram}<br /></>}
                            {contato.facebook && <>📘 {contato.facebook}<br /></>}
                            {contato.youtube && <>▶️ {contato.youtube}</>}
                          </p>
                          <form action={handleDeleteContato} style={{ marginTop: '0.75rem' }}>
                            <input type="hidden" name="id" value={contato.id} />
                            <button type="submit" className="profile-form-btn profile-form-btn-secondary">
                              Remover
                            </button>
                          </form>
                        </div>
                      ))}
                    </div>
                ) : (
                    <div className="area-empty">Nenhum contato registrado.</div>
                  )}
                </div>

                <form id="contatos-step-form" action={handleAddContato} style={{ gridColumn: '1 / -1' }}>
                  <InstituicaoContatoFields pessoas={pessoas} tipos={tiposContato} />
                </form>

                <InstituicaoContatoTipoManager tipos={tiposContato} />
              </div>
            )}

            {activeStep === 'contas' && (
              <div className="module-grid">
                <div className="area-panel-item" style={{ gridColumn: '1 / -1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <strong>Contas bancárias e PIX</strong>
                    <InfoHint label="Ajuda sobre contas" title="Uma ou mais contas oficiais podem ser cadastradas aqui. O cadastro principal é mantido no mesmo fluxo." />
                  </div>

                  {contas.length > 0 ? (
                    <div className="module-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
                      {contas.map((conta: any) => (
                        <div key={conta.id} className="area-panel-item">
                          <strong>{conta.nome || 'Conta bancária'}</strong>
                          <p style={{ marginTop: '0.5rem' }}>
                            {conta.banco && <>🏦 {conta.banco}<br /></>}
                            {conta.agencia && <>🏛️ Agência {conta.agencia}<br /></>}
                            {conta.conta && <>💳 Conta {conta.conta}<br /></>}
                            {conta.titular && <>👤 {conta.titular}<br /></>}
                            {conta.chave_pix && <>🔑 PIX cadastrado</>}
                          </p>
                          <form action={handleDeleteConta} style={{ marginTop: '0.75rem' }}>
                            <input type="hidden" name="id" value={conta.id} />
                            <button type="submit" className="profile-form-btn profile-form-btn-secondary">
                              Remover
                            </button>
                          </form>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="area-empty">Nenhuma conta registrada.</div>
                  )}
                </div>

                <form id="contas-step-form" action={handleAddConta} style={{ gridColumn: '1 / -1' }}>
                  <div className="module-grid">
                    <label className="profile-form-field" style={{ gridColumn: '1 / -1' }}>
                      <span>Nome *</span>
                      <input name="nome" className="profile-form-input" placeholder="Conta principal" required />
                    </label>
                    <label className="profile-form-field">
                      <span>Banco</span>
                      <input name="banco" className="profile-form-input" />
                    </label>
                    <label className="profile-form-field">
                      <span>Agência</span>
                      <input name="agencia" className="profile-form-input" />
                    </label>
                    <label className="profile-form-field">
                      <span>Conta</span>
                      <input name="conta" className="profile-form-input" />
                    </label>
                    <label className="profile-form-field">
                      <span>Tipo de conta</span>
                      <input name="tipo_conta" className="profile-form-input" placeholder="Corrente / Poupança" />
                    </label>
                    <label className="profile-form-field">
                      <span>Titular</span>
                      <input name="titular" className="profile-form-input" />
                    </label>
                    <label className="profile-form-field">
                      <span>CPF/CNPJ do titular</span>
                      <input name="cpf_cnpj_titular" className="profile-form-input" />
                    </label>
                    <label className="profile-form-field">
                      <span>Chave PIX</span>
                      <input name="chave_pix" className="profile-form-input" />
                    </label>
                    <label className="profile-form-field">
                      <span>Tipo da chave PIX</span>
                      <input name="tipo_chave_pix" className="profile-form-input" placeholder="CPF, CNPJ, email, telefone" />
                    </label>
                    <label className="profile-form-field">
                      <span>Finalidade</span>
                      <input name="finalidade" className="profile-form-input" placeholder="Dízimo, doações, despesas..." />
                    </label>
                    <label className="profile-form-field">
                      <span>Visibilidade</span>
                      <select name="visibilidade" className="profile-form-input" defaultValue="privada">
                        <option value="privada">Privada</option>
                        <option value="publica">Pública</option>
                      </select>
                    </label>
                  </div>

                </form>
              </div>
            )}
        </div>
      </section>
    </div>
  );
}

export default async function EditInstituicaoPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>}>
      <EditInstituicaoContent searchParams={resolvedSearchParams} />
    </Suspense>
  );
}
