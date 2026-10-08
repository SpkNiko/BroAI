import Link from "next/link";
import { redirect } from "next/navigation";
import { loginAction } from "@/app/(auth)/actions";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
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

        <h1>Zaloguj się</h1>

        <p>
          Wejdź do swojego workspace.
        </p>

        <form
          action={loginAction}
          className="stack"
        >
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
              required
              autoComplete="current-password"
            />
          </div>

          <button
            className="btn btn-primary"
            type="submit"
          >
            Zaloguj
          </button>
        </form>

        <div
          className="small muted"
          style={{
            marginTop: 18,
          }}
        >
          Nie masz konta?{" "}
          <Link
            href="/register"
            style={{
              color: "white",
            }}
          >
            Utwórz je
          </Link>
          .
        </div>
      </div>
    </main>
  );
}
