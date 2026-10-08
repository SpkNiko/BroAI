import Link from "next/link";

import {
  ArrowRight,
  BookOpen,
  Code2,
  MessageCircle,
} from "lucide-react";

import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user =
    await getCurrentUser();

  if (user) {
    return (
      <main className="auth-shell">
        <div
          className="hero"
          style={{
            width: "min(980px, 100%)",
          }}
        >
          <div className="row small muted">
            BROAI · AI WORKSPACE
          </div>

          <h1>
            Hej{" "}
            {user.name ??
              user.email.split("@")[0]}{" "}
            👋
          </h1>

          <p>
            Masz już konto. Wejdź do
            swojego workspace i wybierz
            tryb.
          </p>

          <div
            className="row"
            style={{
              marginTop: 20,
            }}
          >
            <Link
              className="btn btn-primary"
              href="/app"
            >
              Otwórz BroAI{" "}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-shell">
      <div
        style={{
          width: "min(1100px, 100%)",
        }}
        className="stack"
      >
        <section className="hero">
          <div className="small muted">
            BROAI
          </div>

          <h1>
            Jedna aplikacja.
            <br />
            Trzy tryby. 🧠
          </h1>

          <p>
            Programista do budowania
            rzeczy, Gadanie do zwykłej
            rozmowy i Nauka do rozwijania
            umiejętności. Do tego projekty,
            pamięć użytkownika i workspace
            kodu.
          </p>

          <div
            className="row"
            style={{
              marginTop: 22,
            }}
          >
            <Link
              className="btn btn-primary"
              href="/register"
            >
              Załóż konto{" "}
              <ArrowRight size={16} />
            </Link>

            <Link
              className="btn btn-ghost"
              href="/login"
            >
              Zaloguj się
            </Link>
          </div>
        </section>

        <section className="grid-3">
          <div className="card mode-card">
            <div className="icon-wrap">
              <Code2 size={20} />
            </div>

            <h3>
              Programista
            </h3>

            <p>
              Pliki, edytor, diff,
              konsola i AI do pracy
              nad projektem.
            </p>
          </div>

          <div className="card mode-card">
            <div className="icon-wrap">
              <MessageCircle
                size={20}
              />
            </div>

            <h3>
              Gadanie
            </h3>

            <p>
              Naturalna rozmowa
              z pamięcią i
              personalizacją.
            </p>
          </div>

          <div className="card mode-card">
            <div className="icon-wrap">
              <BookOpen size={20} />
            </div>

            <h3>
              Nauka
            </h3>

            <p>
              Tutor, ćwiczenia
              i śledzenie
              postępów.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
