import { redirect } from "next/navigation";

type SearchParams = Record<string, string | string[] | undefined>;

export const metadata = {
  title: "Observabilidade - Admin GEEF",
};

export default async function ErrosPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedSearchParams = await searchParams;
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (typeof value === "string" && value.trim()) {
      params.set(key, value);
    }
  }

  const query = params.toString();
  redirect(query ? `/admin/observability?${query}` : "/admin/observability");
}
