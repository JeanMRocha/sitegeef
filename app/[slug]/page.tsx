import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPageView } from "@/components/content-page";
import { contentPages } from "@/lib/site-data";

type Params = {
  slug: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = contentPages[slug];
  if (!page) {
    return {};
  }
  return {
    title: `${page.title} | GEEF`,
    description: page.summary,
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = contentPages[slug];

  if (!page) {
    notFound();
  }

  return <ContentPageView page={page} />;
}
