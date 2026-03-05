import { redirect } from "next/navigation";
import { getBeratungProject } from "@/lib/beratung/project-data";
import { notFound } from "next/navigation";

export default async function BeratungDashboard({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getBeratungProject(slug);

  if (!project) {
    notFound();
  }

  // Redirect to first step
  redirect(`/beratung/${slug}/1`);
}
