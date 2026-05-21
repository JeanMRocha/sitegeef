import { site } from "@/lib/site-data";
import type { PublicContactData, PublicChannelLink } from "@/lib/site-contact";

function normalizeWebsite(value?: string | null) {
  const raw = value?.trim();
  if (!raw) {
    return "";
  }

  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  return `https://${raw.replace(/^\/+/, "")}`;
}

function normalizeHandle(value?: string | null) {
  const raw = value?.trim();
  if (!raw) {
    return "";
  }

  return raw.replace(/^@/, "").trim();
}

function normalizePhoneLink(value: string) {
  return `tel:${value.replace(/[^\d+]/g, "")}`;
}

function collectSocials(): PublicChannelLink[] {
  return [
    site.instagram
      ? {
          label: "Instagram",
          href: `https://instagram.com/${normalizeHandle(site.instagram)}`,
          display: site.instagram,
        }
      : null,
    site.facebook
      ? {
          label: "Facebook",
          href: `https://facebook.com/${normalizeHandle(site.facebook)}`,
          display: site.facebook,
        }
      : null,
    site.youtube
      ? {
          label: "YouTube",
          href: normalizeWebsite(site.youtube),
          display: site.youtube.replace(/^https?:\/\//i, ""),
        }
      : null,
  ].filter(Boolean) as PublicChannelLink[];
}

export function getPublicContactDataStatic(): PublicContactData {
  return {
    institutionName: site.name,
    institutionShortName: site.shortName,
    intro: "Encontre aqui os canais de contato da casa, de forma simples e direta.",
    address: {
      title: "Endereço oficial",
      value: site.address,
      note: "Mapa da casa",
    },
    phone: {
      title: "Telefone e WhatsApp",
      value: site.phone,
      href: normalizePhoneLink(site.phone),
    },
    email: {
      title: "E-mail oficial",
      value: site.email,
      href: `mailto:${site.email}`,
    },
    socials: collectSocials(),
    cards: [
      { title: "Endereço oficial", value: site.address, note: "Mapa da casa" },
      { title: "Telefone e WhatsApp", value: site.phone, href: normalizePhoneLink(site.phone), note: "Contato direto" },
      { title: "E-mail oficial", value: site.email, href: `mailto:${site.email}`, note: "Resposta por e-mail" },
    ],
  };
}
