import { notFound } from "next/navigation";
import { getBeratungProject } from "@/lib/beratung/project-data";
import { STEPS } from "@/lib/beratung-steps";
import { StepView } from "@/components/beratung/step-view";

export default async function BeratungStep({
  params,
}: {
  params: Promise<{ slug: string; step: string }>;
}) {
  const { slug, step: stepStr } = await params;
  const project = getBeratungProject(slug);
  const step = parseInt(stepStr, 10);

  if (!project || isNaN(step) || step < 1 || step > STEPS.length) {
    notFound();
  }

  return <StepView project={project} step={step} />;
}
