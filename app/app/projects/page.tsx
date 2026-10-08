import Link from "next/link";

import {
  FolderKanban,
  Plus,
} from "lucide-react";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";

export default async function ProjectsPage() {
  const user =
    await requireUser();

  const projects =
    await prisma.project.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

  return (
    <AppShell
      user={user}
      title="Projekty"
    >
      <div className="content stack">
        <div className="space-between">
          <div>
            <h2
              style={{ margin: 0 }}
            >
              Projekty
            </h2>

            <div className="muted">
              Miejsce na projekty gry
              i kod.
            </div>
          </div>

          <Link
            className="btn btn-primary"
            href="/app/projects/new"
          >
            <Plus size={16} />
            Nowy projekt
          </Link>
        </div>

        <div className="grid-2">
          {projects.map(
            (project) => (
              <Link
                key={project.id}
                href={`/app/projects/${project.id}`}
                className="card mode-card"
              >
                <div className="row">
                  <div
                    className="icon-wrap"
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    <FolderKanban
                      size={18}
                    />
                  </div>

                  <div>
                    <h3
                      style={{
                        margin: 0,
                      }}
                    >
                      {project.name}
                    </h3>

                    <div className="small muted">
                      {project.engine ??
                        "Engine nie ustawiony"}
                    </div>
                  </div>
                </div>

                <p
                  style={{
                    marginTop: 12,
                  }}
                >
                  {project.description ??
                    "Bez opisu."}
                </p>
              </Link>
            )
          )}
        </div>
      </div>
    </AppShell>
  );
}
