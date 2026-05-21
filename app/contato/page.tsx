import type { Metadata } from "next";
import { ContactPageView } from "@/components/contact-page";
import { getLocalizedContentPage } from "@/lib/multilingual/content";
import { getRequestLocale } from "@/lib/multilingual/server";
import { getPublicContactData } from "@/lib/site-contact";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const page = getLocalizedContentPage("contato", locale);

  if (!page) {
    return {};
  }

  return {
    title: `${page.title} | GEEF`,
    description: page.summary,
  };
}

export default async function ContactPage() {
  const locale = await getRequestLocale();
  const page = getLocalizedContentPage("contato", locale);

  if (!page) {
    return null;
  }

  const contact = await getPublicContactData();

  return <ContactPageView page={page} locale={locale} contact={contact} />;
}
