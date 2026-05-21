import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactPageView } from "@/components/contact-page";
import { ContentPageView } from "@/components/content-page";
import { getLocalizedContentPage } from "@/lib/multilingual/content";
import { getRequestLocale } from "@/lib/multilingual/server";
import { getPublicContactData } from "@/lib/site-contact";

type Params = {
  slug: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const locale = await getRequestLocale();
  const { slug } = await params;
  const page = getLocalizedContentPage(slug, locale);
  if (!page) {
    return {};
  }
  return {
    title: `${page.title} | GEEF`,
    description: page.summary,
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const locale = await getRequestLocale();
  const { slug } = await params;
  const page = getLocalizedContentPage(slug, locale);

  if (!page) {
    notFound();
  }

  if (slug === "contato") {
    const contact = await getPublicContactData();
    return <ContactPageView page={page} locale={locale} contact={contact} />;
  }

  return <ContentPageView page={page} locale={locale} slug={slug} />;
}
