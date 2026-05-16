/**
 * Utilitários para cálculo de datas e períodos de escalas
 */

export function getQuintasFeiras(mes: number, ano: number): Date[] {
  const quintas: Date[] = [];
  const ultimoDia = new Date(ano, mes, 0).getDate();

  for (let dia = 1; dia <= ultimoDia; dia++) {
    const data = new Date(ano, mes - 1, dia);
    // Quinta-feira = 4 (0=domingo, 1=segunda, ..., 4=quinta)
    if (data.getDay() === 4) {
      quintas.push(data);
    }
  }

  return quintas;
}

export function getNomeMes(mes: number): string {
  const nomes = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return nomes[mes - 1] || '';
}

export function formatarData(data: Date | string): string {
  const d = typeof data === 'string' ? new Date(data) : data;
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

export function formatarDataLonga(data: Date | string): string {
  const d = typeof data === 'string' ? new Date(data) : data;
  const diaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const nomeDia = diaSemana[d.getDay()];
  const dia = d.getDate();
  const mes = getNomeMes(d.getMonth() + 1);
  const ano = d.getFullYear();
  return `${nomeDia}, ${dia} de ${mes} de ${ano}`;
}

export function getMesAtual(): { mes: number; ano: number } {
  const agora = new Date();
  return {
    mes: agora.getMonth() + 1,
    ano: agora.getFullYear()
  };
}

export function getProximaQuinta(): Date {
  const agora = new Date();
  const proximoDia = new Date(agora);

  // Se hoje é quinta, pega a próxima quinta
  // Caso contrário, procura a próxima quinta
  do {
    proximoDia.setDate(proximoDia.getDate() + 1);
  } while (proximoDia.getDay() !== 4);

  return proximoDia;
}
