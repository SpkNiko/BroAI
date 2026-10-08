import Link from "next/link";
import { redirect } from "next/navigation";
import { registerAction } from "@/app/(auth)/actions";
import { getCurrentUser } from "@/lib/auth";

export default async function RegisterPage() {
  if (await getCurrentUser()) {
    redirect("/app");
  }

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <div
          className="brand"
          style={{
            padding: 0,
            marginBottom: 20,
          }}
        >
          <div className="brand-mark">
            B
          </div>

          <span>BroAI</span>
        </div>

        <h1>Stwórz konto</h1>

        <p>
          To będzie Twój osobisty
          workspace AI.
        </p>

        <form
          action={registerAction}
          className="stack"
        >
          <div>
            <label
              className="label"
              htmlFor="name"
            >
              Nazwa
            </label>

            <input
              className="input"
              id="name"
              name="name"
              type="text"
              minLength={2}
              maxLength={50}
              required
              autoComplete="name"
            />
          </div>

          <div>
            <label
              className="label"
              htmlFor="email"
            >
              Email
            </label>

            <input
              className="input"
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label
              className="label"
              htmlFor="password"
            >
              Hasło
            </label>

            <input
              className="input"
              id="password"
              name="password"
              type="password"
              minLength={10}
              required
              autoComplete="new-password"
            />
          </div>

          <button
            className="btn btn-primary"
            type="submit"
          >
            Utwórz konto
          </button>
        </form>

        <div
          className="small muted"
          style={{
            marginTop: 18,
          }}
        >
          Masz konto?{" "}
          <Link
            href="/login"
            style={{
              color: "white",
            }}
          >
            Zaloguj się
          </Link>
          .
        </div>
      </div>
    </main>
  );
}
