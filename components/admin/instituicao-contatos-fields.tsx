'use client';

import { useMemo, useState, type InputHTMLAttributes } from 'react';
import { addContatoTipo, deleteContatoTipo, updateContatoTipo } from '@/app/admin/instituicao/actions';

type PessoaOption = {
  id: string;
  nome: string;
  email?: string | null;
};

type TipoOption = {
  id: string;
  label: string;
  ordem?: number;
};

function normalizeLabel(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, '');
}

function formatPhoneValue(value: string) {
  const digits = digitsOnly(value).slice(0, 11);
  const extra = digitsOnly(value).slice(11);

  if (!digits) {
    return '';
  }

  if (digits.length === 1) {
    return `(${digits}${extra ? ` ${extra}` : ''}`;
  }

  if (digits.length === 2) {
    return `(${digits})${extra ? ` ${extra}` : ''}`;
  }

  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);

  if (rest.length <= 4) {
    return `(${ddd}) ${rest}${extra ? ` ${extra}` : ''}`;
  }

  if (rest.length <= 8) {
    return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}${extra ? ` ${extra}` : ''}`;
  }

  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}${extra ? ` ${extra}` : ''}`;
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function looksLikeInstagram(value: string) {
  const normalized = value.trim().toLowerCase();
  return normalized.startsWith('@') || normalized.includes('instagram.com/') || normalized.includes('instagr.am/');
}

function looksLikeFacebook(value: string) {
  const normalized = value.trim().toLowerCase();
  return normalized.startsWith('http') && (normalized.includes('facebook.com/') || normalized.includes('fb.com/'));
}

function looksLikeYouTube(value: string) {
  const normalized = value.trim().toLowerCase();
  return (normalized.startsWith('http') && (normalized.includes('youtube.com/') || normalized.includes('youtu.be/'))) || normalized.startsWith('@');
}

function looksLikeUrl(value: string) {
  const normalized = value.trim().toLowerCase();
  return normalized.startsWith('http://') || normalized.startsWith('https://') || normalized.includes('.');
}

function FieldNote({ warning, helper }: { warning?: string; helper: string }) {
  return (
    <span className={`field-note ${warning ? 'field-note-warning' : ''}`}>
      {warning || helper}
    </span>
  );
}

function ContactTextField({
  label,
  name,
  value,
  onChange,
  placeholder,
  helper,
  warning,
  type = 'text',
  inputMode,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helper: string;
  warning?: string;
  type?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
}) {
  return (
    <label className="profile-form-field">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        inputMode={inputMode}
        className="profile-form-input"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <FieldNote warning={warning} helper={helper} />
    </label>
  );
}

export function InstituicaoContatoTipoManager({ tipos }: { tipos: TipoOption[] }) {
  const [novoTipo, setNovoTipo] = useState('');
  const [editando, setEditando] = useState(false);

  return (
    <div className="area-panel-item area-panel-item-full">
      <div className="flex-space-between-wrap">
        <strong>Gerenciar tipos</strong>
        <button type="button" className="profile-form-btn profile-form-btn-secondary" onClick={() => setEditando((current) => !current)}>
          {editando ? 'Ocultar' : 'Editar opções'}
        </button>
      </div>
      <p className="form-hint">
        Esses tipos são compartilhados entre usuários. Altere aqui e o dropdown da instituição reflete a mudança no próximo carregamento.
      </p>

      {editando ? (
        <div className="tipo-manager-grid">
          {tipos.map((tipo) => (
            <div
              key={tipo.id}
              className="tipo-manager-row"
            >
              <form action={updateContatoTipo} className="form-display-contents">
                <input type="hidden" name="id" value={tipo.id} />
                <input type="hidden" name="ordem" value={tipo.ordem ?? 999} />
                <input type="text" name="label" defaultValue={tipo.label} className="profile-form-input" />
                <button type="submit" className="profile-form-btn profile-form-btn-primary">
                  Salvar
                </button>
              </form>
              <form action={deleteContatoTipo}>
                <input type="hidden" name="id" value={tipo.id} />
                <button type="submit" className="profile-form-btn profile-form-btn-secondary">
                  Remover
                </button>
              </form>
            </div>
          ))}

          <form
            action={addContatoTipo}
            className="tipo-manager-form-add"
          >
            <input
              type="text"
              name="label"
              value={novoTipo}
              className="profile-form-input"
              placeholder="Nova opção de tipo"
              onChange={(event) => setNovoTipo(event.target.value)}
            />
            <button
              type="submit"
              className="profile-form-btn profile-form-btn-primary"
            >
              Adicionar
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

export function InstituicaoContatoFields({ pessoas, tipos }: { pessoas: PessoaOption[]; tipos: TipoOption[] }) {
  const [selectedTipoId, setSelectedTipoId] = useState<string>(tipos[0]?.id ?? '');
  const [telefone, setTelefone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [youtube, setYoutube] = useState('');
  const [site, setSite] = useState('');
  const [responsavelId, setResponsavelId] = useState('');

  const selectedTipo = useMemo(() => tipos.find((tipo) => tipo.id === selectedTipoId) ?? tipos[0] ?? null, [selectedTipoId, tipos]);

  const tipoValue = normalizeLabel(selectedTipo?.label || 'Contato');
  const telefoneWarning = useMemo(() => {
    const digits = digitsOnly(telefone);
    if (!digits) {
      return '';
    }

    if (digits.length < 10) {
      return 'Use DDD + número com pelo menos 10 dígitos.';
    }

    if (digits.length > 11) {
      return 'Revise: há mais de 11 dígitos no telefone.';
    }

    return '';
  }, [telefone]);

  const whatsappWarning = useMemo(() => {
    const digits = digitsOnly(whatsapp);
    if (!digits) {
      return '';
    }

    if (digits.length < 10) {
      return 'Use DDD + número com pelo menos 10 dígitos.';
    }

    if (digits.length > 11) {
      return 'Revise: há mais de 11 dígitos no WhatsApp.';
    }

    return '';
  }, [whatsapp]);

  const emailWarning = useMemo(() => {
    if (!email) {
      return '';
    }

    return isEmail(email) ? '' : 'Formato esperado: nome@dominio.com.';
  }, [email]);

  const instagramWarning = useMemo(() => {
    if (!instagram) {
      return '';
    }

    return looksLikeInstagram(instagram) ? '' : 'Use @perfil ou o link do Instagram.';
  }, [instagram]);

  const facebookWarning = useMemo(() => {
    if (!facebook) {
      return '';
    }

    return looksLikeFacebook(facebook) ? '' : 'Use o link da página no Facebook.';
  }, [facebook]);

  const youtubeWarning = useMemo(() => {
    if (!youtube) {
      return '';
    }

    return looksLikeYouTube(youtube) ? '' : 'Use o link do canal ou @canal.';
  }, [youtube]);

  const siteWarning = useMemo(() => {
    if (!site) {
      return '';
    }

    return looksLikeUrl(site) ? '' : 'Prefira URL completa com https://.';
  }, [site]);

  return (
    <div className="module-grid">
      <label className="profile-form-field">
        <span>Tipo *</span>
        <select
          className="profile-form-input"
          value={selectedTipoId}
          onChange={(event) => setSelectedTipoId(event.target.value)}
          required
        >
          {tipos.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>
              {normalizeLabel(tipo.label) || 'Tipo sem nome'}
            </option>
          ))}
        </select>
        <input type="hidden" name="tipo" value={tipoValue} />
        <FieldNote helper="Escolha um tipo da lista compartilhada. Se precisar, edite as opções logo abaixo." />
      </label>

      <label className="profile-form-field">
        <span>Telefone</span>
        <input
          name="telefone"
          type="tel"
          inputMode="numeric"
          className="profile-form-input"
          placeholder="(00) 0000-0000"
          value={telefone}
          onChange={(event) => setTelefone(formatPhoneValue(event.target.value))}
        />
        <FieldNote warning={telefoneWarning} helper="Máscara sugerida: (00) 0000-0000 ou (00) 00000-0000." />
      </label>

      <label className="profile-form-field">
        <span>WhatsApp</span>
        <input
          name="whatsapp"
          type="tel"
          inputMode="numeric"
          className="profile-form-input"
          placeholder="(00) 00000-0000"
          value={whatsapp}
          onChange={(event) => setWhatsapp(formatPhoneValue(event.target.value))}
        />
        <FieldNote warning={whatsappWarning} helper="Máscara sugerida: celular com DDD." />
      </label>

      <ContactTextField
        label="Email"
        name="email"
        value={email}
        onChange={setEmail}
        placeholder="contato@..."
        helper="Use um email válido para contato oficial."
        warning={emailWarning}
      />

      <ContactTextField
        label="Instagram"
        name="instagram"
        value={instagram}
        onChange={setInstagram}
        placeholder="@perfil ou link"
        helper="Prefira o @perfil ou o link do perfil."
        warning={instagramWarning}
      />

      <ContactTextField
        label="Facebook"
        name="facebook"
        value={facebook}
        onChange={setFacebook}
        placeholder="URL da página"
        helper="Use a URL da página ou do perfil."
        warning={facebookWarning}
      />

      <ContactTextField
        label="YouTube"
        name="youtube"
        value={youtube}
        onChange={setYoutube}
        placeholder="URL do canal"
        helper="Use o link do canal ou @canal."
        warning={youtubeWarning}
      />

      <label className="profile-form-field form-field-full">
        <span>Site</span>
        <input
          name="site"
          className="profile-form-input"
          placeholder="https://..."
          value={site}
          onChange={(event) => setSite(event.target.value)}
        />
        <FieldNote warning={siteWarning} helper="Prefira a URL completa do site institucional." />
      </label>

      <label className="profile-form-field form-field-full">
        <span>Responsável (pessoa cadastrada)</span>
        <select
          name="responsavel_id"
          className="profile-form-input"
          value={responsavelId}
          onChange={(event) => setResponsavelId(event.target.value)}
          disabled={!pessoas.length}
        >
          <option value="">{pessoas.length ? 'Selecione uma pessoa' : 'Nenhuma pessoa cadastrada'}</option>
          {pessoas.map((pessoa) => (
            <option key={pessoa.id} value={pessoa.id}>
              {pessoa.nome}
              {pessoa.email ? ` • ${pessoa.email}` : ''}
            </option>
          ))}
        </select>
        <FieldNote
          helper={pessoas.length ? 'O responsável vem da lista de pessoas ativas; não é digitado manualmente.' : 'Cadastre pessoas primeiro para vincular um responsável.'}
        />
      </label>

    </div>
  );
}
