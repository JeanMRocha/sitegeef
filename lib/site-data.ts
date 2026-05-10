export type NavItem = {
  href: string;
  label: string;
};

export type FeatureCard = {
  href: string;
  title: string;
  description: string;
  icon: "group" | "calendar" | "heart" | "live" | "book" | "mail";
};

export type ScheduleItem = {
  title: string;
  when: string;
  description: string;
};

export type PageSection = {
  heading: string;
  text: string;
  bullets?: string[];
};

export type ContentPage = {
  title: string;
  summary: string;
  intro: string;
  ctaLabel: string;
  ctaHref: string;
  sections: PageSection[];
};

const publicCacheVersion = "20260510";

export const site = {
  name: "Grupo Espírita Elias Francis",
  shortName: "GEEF",
  address: "Rua Gwyer de Azevedo, 35, Centro, Santa Maria Madalena-RJ, Brasil",
  email: "contatogeef@gmail.com",
  phone: "(22) 99725-1807",
  youtube: "www.youtube.com/@GrupoEspiritaEliasFrancis",
  instagram: "@grupoespiritaeliasfrancis",
  facebook: "@grupoespiritaeliasfrancis",
};

export function publicHref(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const [pathname, hash = ""] = path.split("#", 2);
  const separator = pathname.includes("?") ? "&" : "?";
  const query = `v=${publicCacheVersion}`;
  return `${pathname}${separator}${query}${hash ? `#${hash}` : ""}`;
}

export const navItems: NavItem[] = [
  { href: publicHref("/quem-somos"), label: "Quem somos" },
  { href: publicHref("/agenda"), label: "Agenda" },
  { href: publicHref("/atividades"), label: "Atividades" },
  { href: publicHref("/estudos"), label: "Estudos" },
  { href: publicHref("/evangelizacao"), label: "Evangelização" },
  { href: publicHref("/atendimento-fraterno"), label: "Atendimento fraterno" },
  { href: publicHref("/ao-vivo"), label: "Ao vivo" },
  { href: publicHref("/contato"), label: "Contato" },
];

export const featureCards: FeatureCard[] = [
  {
    href: publicHref("/quem-somos"),
    title: "Quem somos",
    description: "Missão, valores e história da casa.",
    icon: "group",
  },
  {
    href: publicHref("/agenda"),
    title: "Agenda",
    description: "Reuniões públicas, estudos e eventos.",
    icon: "calendar",
  },
  {
    href: publicHref("/atendimento-fraterno"),
    title: "Atendimento fraterno",
    description: "Escuta, acolhimento e orientação.",
    icon: "heart",
  },
  {
    href: publicHref("/ao-vivo"),
    title: "Ao vivo",
    description: "Transmissões e gravações no YouTube.",
    icon: "live",
  },
  {
    href: publicHref("/estudos"),
    title: "Estudos",
    description: "Evangelho, doutrina e formação contínua.",
    icon: "book",
  },
  {
    href: publicHref("/contato"),
    title: "Contato",
    description: "Endereço, telefone e redes sociais.",
    icon: "mail",
  },
];

export const schedule: ScheduleItem[] = [
  {
    title: "Estudo doutrinário",
    when: "Segundas e quintas, 19h30",
    description: "Leitura, conversa e reflexão sobre a Doutrina Espírita.",
  },
  {
    title: "Reunião pública",
    when: "Sábados, 19h",
    description: "Palestra, acolhimento e encerramento com prece.",
  },
  {
    title: "Atendimento fraterno",
    when: "Sob agendamento",
    description: "Escuta individual para quem busca apoio e orientação.",
  },
  {
    title: "Evangelização",
    when: "Domingos, 9h30",
    description: "Atividades e estudo voltados para crianças e jovens.",
  },
];

export const contentPages: Record<string, ContentPage> = {
  "quem-somos": {
    title: "Quem somos",
    summary: "Conheça a história, a missão, os valores e a forma de trabalho da casa.",
    intro:
      "O Grupo Espírita Elias Francis é uma casa de estudo, acolhimento e serviço fraterno. Nossa atuação prioriza a simplicidade, o respeito, a caridade e a continuidade de uma história marcada por presença e serviço.",
    ctaLabel: "Ver agenda",
    ctaHref: publicHref("/agenda"),
    sections: [
      {
        heading: "Nossa missão",
        text: "Acolher, estudar e servir, oferecendo uma referência segura para quem busca orientação espiritual e convivência fraterna.",
      },
      {
        heading: "Nossa história",
        text: "A casa preserva a memória de um trabalho espiritual que nasceu da dedicação fraterna e se consolidou como ponto de encontro para estudo, assistência e evangelização.",
        bullets: [
          "Origem ligada ao trabalho de Elias Francis.",
          "Caminho sustentado por continuidade e simplicidade.",
          "Compromisso com presença fraterna e serviço à comunidade.",
        ],
      },
      {
        heading: "Nossos valores",
        text: "Toda a comunicação da casa deve refletir serenidade, clareza e respeito pela trajetória da instituição.",
        bullets: [
          "Caridade sem ostentação.",
          "Estudo com disciplina e humildade.",
          "Acolhimento sem burocracia.",
          "Comunicação clara e confiável.",
        ],
      },
      {
        heading: "Como trabalhamos",
        text: "Valorizamos a leitura, a prática do evangelho e o atendimento humano, sem complicar o acesso à casa.",
        bullets: [
          "Reuniões públicas abertas.",
          "Estudos regulares.",
          "Atendimento fraterno com escuta.",
          "Evangelização e convivência para diferentes faixas etárias.",
        ],
      },
    ],
  },
  agenda: {
    title: "Agenda",
    summary: "Agenda inicial das atividades públicas.",
    intro:
      "A agenda abaixo é uma base simples para o site público. Ela pode depois ser mantida manualmente ou integrada ao fluxo administrativo.",
    ctaLabel: "Falar com a casa",
    ctaHref: publicHref("/contato"),
    sections: [
      {
        heading: "Programação semanal",
        text: "A programação foi pensada para ser clara no celular e útil para o visitante que chega pela primeira vez.",
        bullets: schedule.map((item) => `${item.title} - ${item.when}`),
      },
      {
        heading: "Observações",
        text: "Eventos especiais, datas comemorativas e transmissões ao vivo podem ser destacados na página inicial.",
      },
    ],
  },
  atividades: {
    title: "Atividades",
    summary: "Atividades fixas e encontros públicos da casa.",
    intro:
      "As atividades organizam o fluxo da casa e ajudam o visitante a entender rapidamente o que acontece em cada horário.",
    ctaLabel: "Ver estudos",
    ctaHref: publicHref("/estudos"),
    sections: [
      {
        heading: "O que oferecemos",
        text: "A base inicial contempla estudo, reunião pública, evangelização, atendimento e ações de acolhimento.",
        bullets: [
          "Palestras e estudo da doutrina.",
          "Evangelização de crianças e jovens.",
          "Atendimento fraterno e acolhimento.",
          "Transmissões ao vivo quando houver evento.",
        ],
      },
    ],
  },
  estudos: {
    title: "Estudos",
    summary: "Leituras e encontros de formação contínua.",
    intro:
      "Os estudos sustentam a vida da casa e permitem crescer com método, serenidade e disciplina.",
    ctaLabel: "Ir para evangelização",
    ctaHref: publicHref("/evangelizacao"),
    sections: [
      {
        heading: "Linhas de estudo",
        text: "O site já fica preparado para informar temas, séries e encontros especiais.",
        bullets: [
          "Evangelho no lar.",
          "Estudo da doutrina espírita.",
          "Leituras orientadas.",
        ],
      },
    ],
  },
  evangelizacao: {
    title: "Evangelização",
    summary: "Espaço de formação e convivência para crianças e jovens.",
    intro:
      "A evangelização é uma das frentes mais importantes da formação moral e social dentro da casa espírita.",
    ctaLabel: "Falar com atendimento",
    ctaHref: publicHref("/atendimento-fraterno"),
    sections: [
      {
        heading: "Proposta",
        text: "Organizar encontros simples, acolhedores e consistentes para crianças, jovens e famílias.",
      },
    ],
  },
  "atendimento-fraterno": {
    title: "Atendimento fraterno",
    summary: "Orientação e acolhimento com respeito e simplicidade.",
    intro:
      "O atendimento fraterno é um espaço de escuta humana e orientação inicial. O site já deixa isso visível sem burocracia.",
    ctaLabel: "Entrar em contato",
    ctaHref: publicHref("/contato"),
    sections: [
      {
        heading: "Como funciona",
        text: "O visitante encontra uma porta aberta para solicitar conversa e acolhimento em horário combinado.",
        bullets: [
          "Escuta respeitosa.",
          "Orientação inicial.",
          "Encaminhamento para estudos ou apoio apropriado.",
        ],
      },
    ],
  },
  doacoes: {
    title: "Doações",
    summary: "Apoio simples e transparente à manutenção da casa.",
    intro:
      "A página de doações começa informativa. Quando houver decisão operacional, ela pode ganhar fluxo mais completo.",
    ctaLabel: "Ir para contato",
    ctaHref: publicHref("/contato"),
    sections: [
      {
        heading: "Uso das contribuições",
        text: "Manutenção da casa, apoio às atividades e pequenos custos operacionais da rotina.",
      },
    ],
  },
  "ao-vivo": {
    title: "Ao vivo",
    summary: "Transmissões e gravações em vídeo.",
    intro:
      "Eventos ao vivo e gravações podem ser divulgados aqui com link direto para o canal do YouTube.",
    ctaLabel: "Abrir YouTube",
    ctaHref: `https://www.youtube.com/@GrupoEspiritaEliasFrancis`,
    sections: [
      {
        heading: "Canal",
        text: "Use esta página como vitrine simples para transmissões, palestras e gravações de encontros relevantes.",
      },
    ],
  },
  contato: {
    title: "Contato",
    summary: "Como falar com a casa e chegar até o espaço físico.",
    intro:
      "O contato inicial deve ser fácil, claro e disponível no primeiro clique.",
    ctaLabel: "Ver privacidade",
    ctaHref: publicHref("/privacidade"),
    sections: [
      {
        heading: "Informações",
        text: "Telefone, e-mail, endereço e redes sociais estão reunidos abaixo para uso rápido.",
      },
    ],
  },
  privacidade: {
    title: "Privacidade",
    summary: "Diretrizes iniciais de privacidade e cuidado com dados.",
    intro:
      "Esta página registra a base inicial de privacidade para o site público. O texto final pode crescer junto com os módulos internos.",
    ctaLabel: "Voltar ao início",
    ctaHref: publicHref("/"),
    sections: [
      {
        heading: "Princípios",
        text: "Coletar o mínimo necessário, explicar o uso dos dados e manter canais de contato simples.",
        bullets: [
          "Dados usados apenas para contato e atendimento.",
          "Sem coleta desnecessária no site público.",
          "Consentimento e finalidade claros quando houver formulários.",
        ],
      },
    ],
  },
};

export const publicSlugs = Object.keys(contentPages);
