import { updatePreferences } from "@/app/app-actions";

import { requireUser } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    saved?: string;
  }>;
}) {
  const user =
    await requireUser();

  const params = searchParams
    ? await searchParams
    : {};

  return (
    <AppShell
      user={user}
      title="Ustawienia"
    >
      <div className="content">
        <div
          className="card"
          style={{
            maxWidth: 700,
          }}
        >
          <h2
            style={{
              marginTop: 0,
            }}
          >
            Personalizacja
          </h2>

          <p className="muted">
            Te ustawienia są wspólne
            dla trybów BroAI.
          </p>

          <form
            action={updatePreferences}
            className="stack"
            style={{
              marginTop: 20,
            }}
          >
            <div>
              <label
                className="label"
                htmlFor="language"
              >
                Język
              </label>

              <select
                className="select"
                name="language"
                id="language"
                defaultValue={
                  user.language
                }
              >
                <option value="pl">
                  Polski
                </option>

                <option value="en">
                  English
                </option>
              </select>
            </div>

            <div>
              <label
                className="label"
                htmlFor="responseStyle"
              >
                Styl odpowiedzi
              </label>

              <select
                className="select"
                name="responseStyle"
                id="responseStyle"
                defaultValue={
                  user.responseStyle
                }
              >
                <option value="balanced">
                  Zbalansowany
                </option>

                <option value="short">
                  Krótki
                </option>

                <option value="detailed">
                  Dokładny
                </option>

                <option value="friendly">
                  Luźny
                </option>
              </select>
            </div>

            {params.saved && (
              <div className="success">
                Zapisano ustawienia.
              </div>
            )}

            <button
              className="btn btn-primary"
              type="submit"
            >
              Zapisz ustawienia
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
