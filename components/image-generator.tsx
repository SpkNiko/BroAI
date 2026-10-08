"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  Download,
  Image as ImageIcon,
  Loader2,
  Sparkles,
} from "lucide-react";

type ImageResponse = {
  image?: string;
  model?: string;
  error?: string;
};

export function ImageGenerator() {
  const [prompt, setPrompt] =
    useState("");

  const [size, setSize] =
    useState("1024x1024");

  const [quality, setQuality] =
    useState("medium");

  const [image, setImage] =
    useState<string | null>(null);

  const [model, setModel] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function generate(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const cleanPrompt =
      prompt.trim();

    if (!cleanPrompt) {
      setError(
        "Najpierw wpisz opis obrazu."
      );

      return;
    }

    setLoading(true);
    setError("");
    setImage(null);
    setModel(null);

    try {
      const response =
        await fetch(
          "/api/ai/image",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              prompt: cleanPrompt,
              size,
              quality,
            }),
          }
        );

      const data =
        (await response.json()) as ImageResponse;

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Nie udało się wygenerować obrazu."
        );
      }

      if (!data.image) {
        throw new Error(
          "API nie zwróciło obrazu."
        );
      }

      setImage(data.image);
      setModel(
        data.model ?? null
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Wystąpił nieznany błąd."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="image-generator-grid">
      <section className="card">
        <div className="row">
          <div className="icon-wrap">
            <Sparkles size={18} />
          </div>

          <div>
            <h3
              style={{
                margin: 0,
              }}
            >
              Generator
            </h3>

            <div className="small muted">
              BroAI Image
            </div>
          </div>
        </div>

        <form
          onSubmit={generate}
          className="stack"
          style={{
            marginTop: 18,
          }}
        >
          <div>
            <label
              className="label"
              htmlFor="image-prompt"
            >
              Opis obrazu
            </label>

            <textarea
              id="image-prompt"
              className="textarea"
              rows={9}
              value={prompt}
              onChange={(event) =>
                setPrompt(
                  event.target.value
                )
              }
              placeholder="Np. cinematiczna scena nocnego miasta, neonowe światła, deszcz, filmowe oświetlenie…"
              disabled={loading}
            />
          </div>

          <div className="grid-2">
            <div>
              <label
                className="label"
                htmlFor="image-size"
              >
                Rozmiar
              </label>

              <select
                id="image-size"
                className="select"
                value={size}
                onChange={(event) =>
                  setSize(
                    event.target.value
                  )
                }
                disabled={loading}
              >
                <option value="1024x1024">
                  1024 × 1024
                </option>

                <option value="1536x1024">
                  1536 × 1024
                </option>

                <option value="1024x1536">
                  1024 × 1536
                </option>

                <option value="auto">
                  Auto
                </option>
              </select>
            </div>

            <div>
              <label
                className="label"
                htmlFor="image-quality"
              >
                Jakość
              </label>

              <select
                id="image-quality"
                className="select"
                value={quality}
                onChange={(event) =>
                  setQuality(
                    event.target.value
                  )
                }
                disabled={loading}
              >
                <option value="low">
                  Low
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="high">
                  High
                </option>
              </select>
            </div>
          </div>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2
                  size={16}
                  className="spin"
                />
                Generowanie…
              </>
            ) : (
              <>
                <ImageIcon size={16} />
                Wygeneruj obraz
              </>
            )}
          </button>
        </form>
      </section>

      <section className="card image-preview-card">
        <div className="space-between">
          <div>
            <h3
              style={{
                margin: 0,
              }}
            >
              Podgląd
            </h3>

            <div className="small muted">
              {model
                ? `Model: ${model}`
                : "Wygenerowany obraz"}
            </div>
          </div>

          {image && (
            <a
              className="btn btn-ghost"
              href={image}
              download="broai-generated.png"
            >
              <Download size={15} />
              Pobierz
            </a>
          )}
        </div>

        <div className="image-preview">
          {image ? (
            <img
              src={image}
              alt="Wygenerowany obraz"
            />
          ) : (
            <div className="image-placeholder">
              <ImageIcon size={34} />

              <span>
                Twój obraz pojawi się
                tutaj.
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
