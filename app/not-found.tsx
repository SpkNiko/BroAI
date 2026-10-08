import Link from "next/link";

export default function NotFound() {
  return (
    <main className="auth-shell">
      <div className="auth-card">
        <h1>
          Nie znaleziono
        </h1>

        <p>
          Ten element BroAI nie istnieje.
        </p>

        <Link
          className="btn btn-primary"
          href="/app"
        >
          Wróć do aplikacji
        </Link>
      </div>
    </main>
  );
}
