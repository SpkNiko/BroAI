"use client";

import {
  FormEvent,
  useState,
} from "react";

import { useRouter } from "next/navigation";

export default function NewProjectPage() {
  const router = useRouter();

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [engine, setEngine] =
    useState("Unity");

  const [busy, setBusy] =
    useState(false);

  const [error, setError] =
    useState("");

  async function submit(
    event: FormEvent
  ) {
    event.preventDefault();

    setBusy(true);
    setError("");

    const response =
      await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          engine,
        }),
      });

    const data =
      await response.json();

    if (!response.ok) {
      setError(
        data.error ??
          "Nie udało się utworzyć projektu."
      );

      setBusy(false);
      return;
    }

    router.push(
      `/app/projects/${data.id}`
    );
  }

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <h1>
          Nowy projekt
        </h1>

        <p>
          Utwórz przestrzeń pod grę
          lub inny projekt.
        </p>

        <form
          className="stack"
          onSubmit={submit}
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
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              required
            />
          </div>

          <div>
            <label
              className="label"
              htmlFor="description"
            >
              Opis
            </label>

            <textarea
              className="textarea"
              id="description"
              rows={4}
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
            />
          </div>

          <div>
            <label
              className="label"
              htmlFor="engine"
            >
              Silnik
            </label>

            <select
              className="select"
              id="engine"
              value={engine}
              onChange={(e) =>
                setEngine(
                  e.target.value
                )
              }
            >
              <option>
                Unity
              </option>

              <option>
                Unreal
              </option>

              <option>
                Godot
              </option>

              <option>
                Inny
              </option>
            </select>
          </div>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <button
            className="btn btn-primary"
            disabled={busy}
          >
            {busy
              ? "Tworzę…"
              : "Utwórz projekt"}
          </button>
        </form>
      </div>
    </main>
  );
}
