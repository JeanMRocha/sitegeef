import { site } from "@/lib/site-data";
import type { Locale } from "./constants";

type HomeQuickLink = {
  href: string;
  title: string;
  description: string;
  icon: "group" | "calendar" | "heart" | "mail" | "privacy";
};

type MultilingualCopy = {
  shell: {
    footer: {
      lgpd: string;
      privacy: string;
      cookies: string;
      credibility: string;
    };
    siteName: string;
    siteAddress: string;
  };
  header: {
    institutional: string;
    more: string;
    account: string;
    contact: string;
    enter: string;
    createAccount: string;
    privacy: string;
    adminPanel: string;
    myProfile: string;
    myArea: string;
    themeLight: string;
    themeDark: string;
    signOut: string;
    language: string;
    portuguese: string;
    english: string;
  };
  cookieBanner: {
    eyebrow: string;
    title: string;
    lead: string;
    acceptAll: string;
    rejectNonEssential: string;
    managePreferences: string;
    policyLink: string;
    essentialTitle: string;
    essentialLead: string;
    marketingTitle: string;
    marketingLead: string;
    analyticsTitle: string;
    analyticsLead: string;
    trackingTitle: string;
    trackingLead: string;
    savePreferences: string;
    ariaLabel: string;
  };
  formNotice: {
    title: string;
    text: string;
    policyLabel: string;
    contactLabel: string;
  };
  home: {
    eyebrow: string;
    title: string;
    motto: {
      text: string;
      attribution: string;
    };
    lead: string;
    highlights: string[];
    primaryCta: string;
    secondaryCta: string;
    quickLinksTitle: string;
    quickLinksLead: string;
    contactTitle: string;
    contactLead: string;
    quickLinks: HomeQuickLink[];
  };
  login: {
    title: string;
    lead: string;
    footer: string;
  };
  adminLanguages: {
    title: string;
    lead: string;
    defaultLanguage: string;
    persistence: string;
    scope: string;
    publicShell: string;
    publicPages: string;
    nextSteps: string;
  };
};

const commonQuickLinks: Record<Locale, HomeQuickLink[]> = {
  pt: [
    {
      href: "/quem-somos",
      title: "Quem somos",
      description: "Missão, valores e história da casa.",
      icon: "group",
    },
    {
      href: "/agenda",
      title: "Agenda",
      description: "Reuniões públicas, estudos e eventos.",
      icon: "calendar",
    },
    {
      href: "/atendimento-fraterno",
      title: "Atendimento fraterno",
      description: "Escuta, acolhimento e orientação.",
      icon: "heart",
    },
    {
      href: "/contato",
      title: "Contato",
      description: "Endereço, telefone e redes sociais.",
      icon: "mail",
    },
    {
      href: "/privacidade",
      title: "Privacidade",
      description: "Como tratamos dados pessoais e cookies.",
      icon: "privacy",
    },
  ],
  en: [
    {
      href: "/quem-somos",
      title: "About us",
      description: "Mission, values and history of the house.",
      icon: "group",
    },
    {
      href: "/agenda",
      title: "Schedule",
      description: "Public meetings, studies and events.",
      icon: "calendar",
    },
    {
      href: "/atendimento-fraterno",
      title: "Fraternal care",
      description: "Listening, welcome and guidance.",
      icon: "heart",
    },
    {
      href: "/contato",
      title: "Contact",
      description: "Address, phone and social channels.",
      icon: "mail",
    },
    {
      href: "/privacidade",
      title: "Privacy",
      description: "How we handle personal data and cookies.",
      icon: "privacy",
    },
  ],
};

const multilingualCopy: Record<Locale, MultilingualCopy> = {
  pt: {
    shell: {
      footer: {
        lgpd: "LGPD",
        privacy: "Privacidade",
        cookies: "Cookies",
        credibility: "Credibilidade e Filiações",
      },
      siteName: site.name,
      siteAddress: site.address,
    },
    header: {
      institutional: "Institucional",
      more: "Mais opções institucionais",
      account: "Acesso à conta",
      contact: "Contato",
      enter: "Entrar",
      createAccount: "Criar conta",
      privacy: "Privacidade",
      adminPanel: "Painel Admin",
      myProfile: "Meu Perfil",
      myArea: "Minha Área",
      themeLight: "Modo Escuro",
      themeDark: "Modo Claro",
      signOut: "Sair",
      language: "Idioma",
      portuguese: "Português",
      english: "Inglês",
    },
    cookieBanner: {
      eyebrow: "Cookies",
      title: "Usamos apenas o necessário para o site funcionar bem.",
      lead: "Cookies essenciais ficam ativos. Os demais dependem da sua escolha. Você pode mudar isso depois na Política de Cookies.",
      acceptAll: "Aceitar todos",
      rejectNonEssential: "Rejeitar não essenciais",
      managePreferences: "Gerenciar preferências",
      policyLink: "Política de Cookies",
      essentialTitle: "Essenciais",
      essentialLead: "Necessários para login, segurança e navegação básica.",
      marketingTitle: "Marketing",
      marketingLead: "Comunicações, ofertas e remarketing.",
      analyticsTitle: "Analytics",
      analyticsLead: "Medição não essencial de uso e navegação.",
      trackingTitle: "Rastreamento",
      trackingLead: "Mensuração de campanha e comportamento.",
      savePreferences: "Salvar preferências",
      ariaLabel: "Preferências de cookies",
    },
    formNotice: {
      title: "Privacidade no formulário",
      text: "Usaremos seus dados só para responder sua solicitação e manter o registro do atendimento.",
      policyLabel: "Ler política",
      contactLabel: "Canal LGPD",
    },
    home: {
      eyebrow: "GEEF · site público",
      title: site.name,
      motto: {
        text: "Fora da Caridade não há salvação",
        attribution: "Allan Kardec",
      },
      lead:
        "Casa de estudo, acolhimento e serviço fraterno. Um ponto de contato claro para agenda, atendimento, transmissão e informação.",
      highlights: ["Agenda, estudos e atendimento em foco", "Leitura rápida no celular e no desktop"],
      primaryCta: "Falar com a casa",
      secondaryCta: "Ver agenda",
      quickLinksTitle: "O que já está pronto no site",
      quickLinksLead: "As páginas abaixo levam direto para o conteúdo real que já pode ser consultado pelo visitante.",
      contactTitle: "Informações oficiais para chegar até a casa",
      contactLead: "Endereço, telefone e redes principais ficam visíveis já na página inicial.",
      quickLinks: commonQuickLinks.pt,
    },
    login: {
      title: "Acesso à conta",
      lead:
        "Entre para continuar no ecossistema GEEF com a sua área pessoal. Registramos eventos de segurança e acesso conforme a política.",
      footer: "Ao continuar, você concorda com nossa política de privacidade e política de cookies.",
    },
    adminLanguages: {
      title: "Idiomas do site",
      lead: "Módulo local de multilinguagem PT/EN para o site público e componentes compartilhados.",
      defaultLanguage: "Idioma padrão",
      persistence: "Persistência por cookie e localStorage, com atualização do `lang` no servidor.",
      scope: "Escopo atual",
      publicShell: "Header, menus, footer, banner LGPD e páginas de entrada.",
      publicPages: "Home, login e textos institucionais principais.",
      nextSteps: "As páginas de conteúdo podem ser migradas por etapas usando o mesmo dicionário.",
    },
  },
  en: {
    shell: {
      footer: {
        lgpd: "LGPD",
        privacy: "Privacy",
        cookies: "Cookies",
        credibility: "Credibility and Affiliations",
      },
      siteName: site.name,
      siteAddress: site.address,
    },
    header: {
      institutional: "Institutional",
      more: "Institutional options",
      account: "Account access",
      contact: "Contact",
      enter: "Sign in",
      createAccount: "Create account",
      privacy: "Privacy",
      adminPanel: "Admin panel",
      myProfile: "My profile",
      myArea: "My area",
      themeLight: "Dark mode",
      themeDark: "Light mode",
      signOut: "Sign out",
      language: "Language",
      portuguese: "Portuguese",
      english: "English",
    },
    cookieBanner: {
      eyebrow: "Cookies",
      title: "We only use what is needed for the site to work well.",
      lead: "Essential cookies stay active. The rest depend on your choice. You can change this later in the Cookie Policy.",
      acceptAll: "Accept all",
      rejectNonEssential: "Reject non-essential",
      managePreferences: "Manage preferences",
      policyLink: "Cookie Policy",
      essentialTitle: "Essential",
      essentialLead: "Needed for login, security and basic browsing.",
      marketingTitle: "Marketing",
      marketingLead: "Messages, offers and remarketing.",
      analyticsTitle: "Analytics",
      analyticsLead: "Non-essential usage and navigation measurement.",
      trackingTitle: "Tracking",
      trackingLead: "Campaign and behavior measurement.",
      savePreferences: "Save preferences",
      ariaLabel: "Cookie preferences",
    },
    formNotice: {
      title: "Privacy in the form",
      text: "We will use your data only to answer your request and keep the service record.",
      policyLabel: "Read policy",
      contactLabel: "LGPD channel",
    },
    home: {
      eyebrow: "GEEF · public site",
      title: site.name,
      motto: {
        text: "Fora da Caridade não há salvação",
        attribution: "Allan Kardec",
      },
      lead:
        "A place for study, welcome and fraternal service. A clear contact point for schedule, care, streaming and information.",
      highlights: ["Schedule, studies and care in focus", "Quick reading on mobile and desktop"],
      primaryCta: "Contact the house",
      secondaryCta: "View schedule",
      quickLinksTitle: "What is already available on the site",
      quickLinksLead: "The pages below go straight to real content that visitors can already browse.",
      contactTitle: "Official information to reach the house",
      contactLead: "Address, phone and main social links are visible on the home page.",
      quickLinks: commonQuickLinks.en,
    },
    login: {
      title: "Account access",
      lead:
        "Sign in to continue in the GEEF ecosystem with your personal area. We record security and access events according to the policy.",
      footer: "By continuing, you agree to our privacy policy and cookies policy.",
    },
    adminLanguages: {
      title: "Site languages",
      lead: "Local PT/EN multilingual module for the public site and shared components.",
      defaultLanguage: "Default language",
      persistence: "Persisted through cookie and localStorage, with server-side `lang` updates.",
      scope: "Current scope",
      publicShell: "Header, menus, footer, LGPD banner and entry pages.",
      publicPages: "Home, login and core institutional texts.",
      nextSteps: "Content pages can be migrated step by step using the same dictionary.",
    },
  },
};

export function getMultilingualCopy(locale: Locale) {
  return multilingualCopy[locale];
}
