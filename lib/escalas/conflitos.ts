/**
 * Utilitários para detectar conflitos nas escalas
 */

export interface Conflito {
  tipo: 'pessoa-repetida' | 'funcao-vazia' | 'data-sem-evento';
  data: string;
  pessoa?: {
    id: string;
    nome: string;
  };
  funcoes?: string[];
  mensagem: string;
}

/**
 * Detecta se uma pessoa aparece em mais de uma função/bloco na mesma data
 */
export function detectarPessoaRepetida(
  data: string,
  funcoes: Array<{ pessoa_id?: string; pessoa_nome?: string; funcao_nome?: string }>,
  passe: Array<{ pessoa_id?: string; pessoa_nome?: string }>,
  evangelizacao: Array<{ pessoa_id?: string; pessoa_nome?: string }>,
  palestras: Array<{ expositor_id?: string; expositor_nome?: string }>
): Conflito[] {
  const conflitos: Conflito[] = [];
  const pessoasVistas = new Map<string, string[]>();

  // Verificar funções
  funcoes.forEach(f => {
    if (f.pessoa_id) {
      const funcoesPessoa = pessoasVistas.get(f.pessoa_id) || [];
      funcoesPessoa.push(`Função: ${f.funcao_nome}`);
      pessoasVistas.set(f.pessoa_id, funcoesPessoa);
    }
  });

  // Verificar passe
  passe.forEach(p => {
    if (p.pessoa_id) {
      const funcoesPessoa = pessoasVistas.get(p.pessoa_id) || [];
      funcoesPessoa.push('Passe');
      pessoasVistas.set(p.pessoa_id, funcoesPessoa);
    }
  });

  // Verificar evangelização
  evangelizacao.forEach(e => {
    if (e.pessoa_id) {
      const funcoesPessoa = pessoasVistas.get(e.pessoa_id) || [];
      funcoesPessoa.push('Evangelização');
      pessoasVistas.set(e.pessoa_id, funcoesPessoa);
    }
  });

  // Verificar palestras
  palestras.forEach(p => {
    if (p.expositor_id) {
      const funcoesPessoa = pessoasVistas.get(p.expositor_id) || [];
      funcoesPessoa.push('Palestra');
      pessoasVistas.set(p.expositor_id, funcoesPessoa);
    }
  });

  // Gerar conflitos
  pessoasVistas.forEach((funcoes, pessoaId) => {
    if (funcoes.length > 1) {
      const nomePessoa =
        funcoes[0].includes(':')
          ? funcoes[0].split(': ')[1]
          : passe.find(p => p.pessoa_id === pessoaId)?.pessoa_nome || pessoaId;

      conflitos.push({
        tipo: 'pessoa-repetida',
        data,
        pessoa: {
          id: pessoaId,
          nome: nomePessoa || 'Desconhecido'
        },
        funcoes,
        mensagem: `⚠️ ${nomePessoa} aparece em múltiplas funções: ${funcoes.join(', ')}`
      });
    }
  });

  return conflitos;
}

/**
 * Valida se todos os blocos obrigatórios foram preenchidos
 */
export function validarEscalaCompleta(
  reunioes: Array<{
    id: string;
    data: string;
    funcoes: Array<{ funcao_id?: string; pessoa_id?: string }>;
    passe: Array<{ pessoa_id?: string }>;
    evangelizacao?: Array<{ pessoa_id?: string }>;
    palestras?: Array<{ expositor_id?: string }>;
  }>
): Conflito[] {
  const conflitos: Conflito[] = [];

  reunioes.forEach(r => {
    const temDirigente = r.funcoes.some(f => f.funcao_id === 'dirigente' && f.pessoa_id);
    const temPasse = r.passe.length > 0;

    if (!temDirigente) {
      conflitos.push({
        tipo: 'funcao-vazia',
        data: r.data,
        mensagem: `❌ ${r.data} - Falta definir Dirigente`
      });
    }

    if (!temPasse) {
      conflitos.push({
        tipo: 'funcao-vazia',
        data: r.data,
        mensagem: `⚠️ ${r.data} - Passe não foi definido`
      });
    }
  });

  return conflitos;
}

/**
 * Resumo de conflitos por tipo
 */
export function resumirConflitos(conflitos: Conflito[]): {
  total: number;
  porTipo: Record<string, number>;
} {
  const porTipo: Record<string, number> = {};

  conflitos.forEach(c => {
    porTipo[c.tipo] = (porTipo[c.tipo] || 0) + 1;
  });

  return {
    total: conflitos.length,
    porTipo
  };
}
