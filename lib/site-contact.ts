import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { site } from "@/lib/site-data";

type InstitutionRow = {
  nome_oficial?: string | null;
  nome_curto?: string | null;
  descricao?: string | null;
};

type AddressRow = {
  cep?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
  maps_link?: string | null;
};

type ContactRow = {
  tipo?: string | null;
  telefone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  youtube?: string | null;
  site?: string | null;
  ativo?: boolean | null;
};

export type PublicChannelLink = {
  label: string;
  href: string;
  display: string;
};

export type PublicContactCard = {
  title: string;
  value: string;
  href?: string;
  note?: string;
};

export type PublicContactData = {
  institutionName: string;
  institutionShortName: string;
  intro: string;
  address: {
    title: string;
    value: string;
    href?: string;
    note?: string;
  };
  phone?: {
    title: string;
    value: string;
    href?: string;
  };
  email?: {
    title: string;
    value: string;
    href?: string;
  };
  socials: PublicChannelLink[];
  cards: PublicContactCard[];
};

function cleanText(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "";
}

function normalizeWebsite(value?: string | null) {
  const raw = cleanText(value);
  if (!raw) {
    return "";
  }

  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  return `https://${raw.replace(/^\/+/, "")}`;
}

function normalizeHandle(value?: string | null) {
  const raw = cleanText(value);
  if (!raw) {
    return "";
  }

  return raw.replace(/^@/, "").trim();
}

function normalizePhoneLink(value: string) {
  return `tel:${value.replace(/[^\d+]/g, "")}`;
}

function normalizeWhatsAppLink(value: string) {
  const digits = value.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

function normalizeMapLink(address: AddressRow, fallbackAddress: string) {
  if (address.maps_link) {
    return address.maps_link;
  }

  const query = encodeURIComponent(fallbackAddress);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function collectUnique(values: Array<{ label: string; href: string; display: string }>) {
  const seen = new Set<string>();

  return values.filter((item) => {
    const key = `${item.label}::${item.display}`.toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export async function getPublicContactData(): Promise<PublicContactData> {
  try {
    const supabase = createServiceRoleClient();

    const [institutionResult, addressResult, contactsResult] = await Promise.all([
      supabase
        .from("instituicao")
        .select("nome_oficial, nome_curto, descricao")
        .order("criado_em", { ascending: true })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("instituicao_enderecos")
        .select("cep, logradouro, numero, complemento, bairro, cidade, estado, maps_link")
        .limit(1)
        .maybeSingle(),
      supabase
        .from("instituicao_contatos")
        .select("tipo, telefone, whatsapp, email, instagram, facebook, youtube, site, ativo")
        .eq("ativo", true)
        .order("tipo", { ascending: true }),
    ]);

    const institution = institutionResult.data as InstitutionRow | null;
    const address = addressResult.data as AddressRow | null;
    const contacts = (contactsResult.data ?? []) as ContactRow[];

    const fallbackAddress = site.address;
    const addressValue = [
      cleanText(address?.logradouro),
      cleanText(address?.numero),
      cleanText(address?.complemento),
      cleanText(address?.bairro),
      cleanText(address?.cidade),
      cleanText(address?.estado),
    ]
      .filter(Boolean)
      .join(", ") || fallbackAddress;

    const phoneCandidate = contacts.find((item) => cleanText(item.whatsapp) || cleanText(item.telefone));
    const emailCandidate = contacts.find((item) => cleanText(item.email));

    const socialCandidatesFromContacts = collectUnique([
      ...contacts.flatMap((item) => {
        const links: Array<{ label: string; href: string; display: string }> = [];
        const instagram = normalizeHandle(item.instagram);
        const facebook = normalizeHandle(item.facebook);
        const youtube = cleanText(item.youtube);
        const website = normalizeWebsite(item.site);

        if (instagram) {
          links.push({
            label: "Instagram",
            href: `https://instagram.com/${instagram}`,
            display: `@${instagram}`,
          });
        }

        if (facebook) {
          links.push({
            label: "Facebook",
            href: `https://facebook.com/${facebook}`,
            display: facebook,
          });
        }

        if (youtube) {
          links.push({
            label: "YouTube",
            href: normalizeWebsite(youtube),
            display: youtube.replace(/^https?:\/\//i, ""),
          });
        }

        if (website) {
          links.push({
            label: "Site",
            href: website,
            display: website.replace(/^https?:\/\//i, ""),
          });
        }

        return links;
      }),
    ]);

    const socialCandidates =
      socialCandidatesFromContacts.length > 0
        ? socialCandidatesFromContacts.slice(0, 4)
        : collectUnique([
            ...(site.instagram
              ? [
                  {
                    label: "Instagram",
                    href: `https://instagram.com/${normalizeHandle(site.instagram)}`,
                    display: site.instagram,
                  },
                ]
              : []),
            ...(site.facebook
              ? [
                  {
                    label: "Facebook",
                    href: `https://facebook.com/${normalizeHandle(site.facebook)}`,
                    display: site.facebook,
                  },
                ]
              : []),
            ...(site.youtube
              ? [
                  {
                    label: "YouTube",
                    href: normalizeWebsite(site.youtube),
                    display: site.youtube,
                  },
                ]
              : []),
          ]).slice(0, 4);

    const phoneValue = cleanText(phoneCandidate?.whatsapp || phoneCandidate?.telefone || site.phone);
    const emailValue = cleanText(emailCandidate?.email || site.email);

    const cards: PublicContactCard[] = [
      {
        title: "Endereço oficial",
        value: addressValue,
        href: normalizeMapLink(address ?? {}, addressValue),
        note: cleanText(address?.cep) || "Mapa da casa",
      },
      {
        title: "Telefone e WhatsApp",
        value: phoneValue,
        href: phoneValue ? (cleanText(phoneCandidate?.whatsapp) ? normalizeWhatsAppLink(phoneValue) : normalizePhoneLink(phoneValue)) : undefined,
        note: phoneCandidate?.tipo || "Contato direto",
      },
      {
        title: "E-mail oficial",
        value: emailValue,
        href: emailValue ? `mailto:${emailValue}` : undefined,
        note: "Resposta por e-mail",
      },
    ];

    return {
      institutionName: cleanText(institution?.nome_oficial) || site.name,
      institutionShortName: cleanText(institution?.nome_curto) || site.shortName,
      intro:
        cleanText(institution?.descricao) ||
        "Encontre aqui os canais de contato da casa, de forma simples e direta.",
      address: {
        title: "Endereço oficial",
        value: addressValue,
        href: normalizeMapLink(address ?? {}, addressValue),
        note: cleanText(address?.cep) || "Mapa da casa",
      },
      phone: phoneValue
        ? {
            title: "Telefone e WhatsApp",
            value: phoneValue,
            href: cleanText(phoneCandidate?.whatsapp) ? normalizeWhatsAppLink(phoneValue) : normalizePhoneLink(phoneValue),
          }
        : undefined,
      email: emailValue
        ? {
            title: "E-mail oficial",
            value: emailValue,
            href: `mailto:${emailValue}`,
          }
        : undefined,
      socials: socialCandidates,
      cards,
    };
  } catch {
    const fallbackSocials = [
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
            display: site.youtube,
          }
        : null,
    ].filter(Boolean) as PublicChannelLink[];

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
      socials: fallbackSocials,
      cards: [
        { title: "Endereço oficial", value: site.address, note: "Mapa da casa" },
        { title: "Telefone e WhatsApp", value: site.phone, href: normalizePhoneLink(site.phone), note: "Contato direto" },
        { title: "E-mail oficial", value: site.email, href: `mailto:${site.email}`, note: "Resposta por e-mail" },
      ],
    };
  }
}
