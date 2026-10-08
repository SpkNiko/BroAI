import {
  BookOpen,
  Brain,
  Trophy,
} from "lucide-react";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";
import { ChatClient } from "@/components/chat-client";

export default async function LearnPage() {
  const user =
    await requireUser();

  const progress =
    await prisma.learningProgress.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 6,
    });

  return (
    <AppShell
      user={user}
      title="Nauka"
    >
      <div className="content stack">
        <div className="grid-3">
          <div className="card">
            <div className="icon-wrap">
              <BookOpen size={18} />
            </div>

            <h3>Tematy</h3>

            <p>
              Buduj własną ścieżkę nauki.
            </p>
          </div>

          <div className="card">
            <div className="icon-wrap">
              <Brain size={18} />
            </div>

            <h3>Powtórki</h3>

            <p>
              Wracaj do rzeczy, które
              wymagają pracy.
            </p>
          </div>

          <div className="card">
            <div className="icon-wrap">
              <Trophy size={18} />
            </div>

            <h3>Postęp</h3>

            <p>
              Śledź wyniki i regularność.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="space-between">
            <h3 style={{ margin: 0 }}>
              Twój postęp
            </h3>

            <span className="small muted">
              0 = start · 100 = mocno
              opanowane
            </span>
          </div>

          <div
            className="stack"
            style={{ marginTop: 14 }}
          >
            {progress.length === 0 ? (
              <div className="muted">
                Na razie brak zapisanych
                tematów. Zacznij od rozmowy
                z tutorem poniżej.
              </div>
            ) : (
              progress.map((item) => (
                <div
                  key={item.id}
                  className="learning-card"
                >
                  <div className="space-between">
                    <span>
                      {item.subject}
                    </span>

                    <span className="small muted">
                      {Math.round(
                        item.score
                      )}
                      %
                    </span>
                  </div>

                  <div className="progress">
                    <div
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(
                            100,
                            item.score
                          )
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div
          style={{
            height: 420,
            minHeight: 0,
            border:
              "1px solid var(--border)",
            borderRadius: 18,
            overflow: "hidden",
          }}
        >
          <ChatClient mode="LEARN" />
        </div>
      </div>
    </AppShell>
  );
}
