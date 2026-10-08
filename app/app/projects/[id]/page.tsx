import Link from "next/link";
import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const user =
    await requireUser();

  const { id } =
    await params;

  const project =
    await prisma.project.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        files: {
          orderBy: {
            path: "asc",
          },
        },
      },
    });

  if (!project) {
    notFound();
  }

  return (
    <AppShell
      user={user}
      title={project.name}
    >
      <div className="content stack">
        <div className="hero">
          <div className="small muted">
            PROJECT
          </div>

          <h1>
            {project.name}
          </h1>

          <p>
            {project.description ??
              "Brak opisu."}
          </p>

          <div
            className="row"
            style={{
              marginTop: 16,
            }}
          >
            <Link
              className="btn btn-primary"
              href="/app/programmer"
            >
              Otwórz workspace
            </Link>
          </div>
        </div>

        <div className="card">
          <h3>
            Pliki projektu
          </h3>

          <div
            className="stack"
            style={{
              marginTop: 12,
            }}
          >
            {project.files.length ===
            0 ? (
              <div className="muted">
                Brak plików w bazie.
                Workspace startowy jest
                obecnie lokalnym preview.
              </div>
            ) : (
              project.files.map((file) => (
                <div
                  key={file.id}
                  className="space-between"
                >
                  <span>
                    {file.path}
                  </span>

                  <span className="small muted">
                    {file.language}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
