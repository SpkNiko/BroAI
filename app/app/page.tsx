import Link from "next/link";

import {
  ArrowRight,
  BookOpen,
  Code2,
  FolderKanban,
  Image as ImageIcon,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app-shell";

export default async function AppDashboard() {
  const user =
    await requireUser();

  const [
    projects,
    conversations,
    memoryCount,
  ] = await Promise.all([
    prisma.project.count({
      where: {
        userId: user.id,
      },
    }),

    prisma.conversation.count({
      where: {
        userId: user.id,
      },
    }),

    prisma.memory.count({
      where: {
        userId: user.id,
      },
    }),
  ]);

  return (
    <AppShell
      user={user}
      title="Dashboard"
    >
      <div className="content stack">
        <section className="hero">
          <div className="row small muted">
            <Sparkles size={14} />
            TWOJE AI W JEDNYM MIEJSCU
          </div>

          <h1>
            Co robimy dzisiaj?
          </h1>

          <p>
            Wybierz tryb i działaj. To jest
            baza BroAI — kolejne moduły
            możemy rozwijać bez przebudowy
            całej aplikacji.
          </p>
        </section>

        <section className="grid-2">
          <Link
            className="card mode-card"
            href="/app/programmer"
          >
            <div className="icon-wrap">
              <Code2 size={21} />
            </div>

            <h3>Programista</h3>

            <p>
              Workspace kodu, pliki,
              diff, console i AI.
            </p>

            <div
              className="row small"
              style={{ marginTop: 14 }}
            >
              Otwórz
              <ArrowRight size={15} />
            </div>
          </Link>

          <Link
            className="card mode-card"
            href="/app/chat"
          >
            <div className="icon-wrap">
              <MessageCircle size={21} />
            </div>

            <h3>Gadanie</h3>

            <p>
              Naturalny chat z pamięcią
              i ustawieniami.
            </p>

            <div
              className="row small"
              style={{ marginTop: 14 }}
            >
              Otwórz
              <ArrowRight size={15} />
            </div>
          </Link>

          <Link
            className="card mode-card"
            href="/app/learn"
          >
            <div className="icon-wrap">
              <BookOpen size={21} />
            </div>

            <h3>Nauka</h3>

            <p>
              Tutor i postęp nauki
              użytkownika.
            </p>

            <div
              className="row small"
              style={{ marginTop: 14 }}
            >
              Otwórz
              <ArrowRight size={15} />
            </div>
          </Link>

          <Link
            className="card mode-card"
            href="/app/images"
          >
            <div className="icon-wrap">
              <ImageIcon size={21} />
            </div>

            <h3>Obrazy</h3>

            <p>
              Generowanie grafik przez
              osobny moduł obrazów.
            </p>

            <div
              className="row small"
              style={{ marginTop: 14 }}
            >
              Otwórz
              <ArrowRight size={15} />
            </div>
          </Link>
        </section>

        <section className="grid-3">
          <div className="card">
            <div className="row small muted">
              <FolderKanban size={14} />
              PROJEKTY
            </div>

            <div
              style={{
                fontSize: 30,
                fontWeight: 800,
                marginTop: 8,
              }}
            >
              {projects}
            </div>
          </div>

          <div className="card">
            <div className="small muted">
              ROZMOWY
            </div>

            <div
              style={{
                fontSize: 30,
                fontWeight: 800,
                marginTop: 8,
              }}
            >
              {conversations}
            </div>
          </div>

          <div className="card">
            <div className="small muted">
              PAMIĘĆ
            </div>

            <div
              style={{
                fontSize: 30,
                fontWeight: 800,
                marginTop: 8,
              }}
            >
              {memoryCount}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
