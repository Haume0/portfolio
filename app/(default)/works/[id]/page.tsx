import { notFound } from "next/navigation";
import { getAllProjects, getProject } from "@/lib/projects";
import Works from "../page";

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ id: project.id }));
}

// Ayrı bir proje sayfası yok: works listesi render edilir, WorksIndex pathname'den
// projeyi bulup önizleme modalını açık başlatır.
export default async function WorkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!getProject(id)) {
    notFound();
  }

  return <Works />;
}
