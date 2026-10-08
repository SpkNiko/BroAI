"use client";

import {
  FormEvent,
  useState,
} from "react";

import { Send } from "lucide-react";

type Message = {
  role:
    | "user"
    | "assistant";
  content: string;
};

export function ChatClient({
  mode,
}: {
  mode:
    | "CHAT"
    | "PROGRAMMER"
    | "LEARN";
}) {
  const [messages, setMessages] =
    useState<Message[]>([]);

  const [input, setInput] =
    useState("");

  const [provider, setProvider] =
    useState("openai");

  const [busy, setBusy] =
    useState(false);

  async function submit(
    event: FormEvent
  ) {
    event.preventDefault();

    const content =
      input.trim();

    if (!content || busy) {
      return;
    }

    const next = [
      ...messages,
      {
        role: "user",
        content,
      } as Message,
    ];

    setMessages(next);
    setInput("");
    setBusy(true);

    try {
      const res =
        await fetch("/api/ai/chat", {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            mode,
            provider,
            messages: next,
          }),
        });

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ?? "Błąd AI"
        );
      }

      setMessages(
        (current) => [
          ...current,
          {
            role: "assistant",
            content:
              data.content,
          },
        ]
      );
    } catch (error) {
      setMessages(
        (current) => [
          ...current,
          {
            role: "assistant",
            content:
              error instanceof Error
                ? error.message
                : "Wystąpił błąd.",
          },
        ]
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="chat-layout">
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="card">
            <div className="small muted">
              START
            </div>

            <h3>
              Jestem gotowy.
            </h3>

            <p>
              Wpisz zadanie, pytanie
              albo problem.
              Router może później
              zostać rozbudowany
              o wybór konkretnych
              modeli.
            </p>
          </div>
        )}

        {messages.map(
          (message, index) => (
            <div
              className={`message ${message.role}`}
              key={`${message.role}-${index}`}
            >
              {message.content}
            </div>
          )
        )}
      </div>

      <div className="chat-input">
        <form
          className="chat-form"
          onSubmit={submit}
        >
          <div
            className="row"
            style={{
              alignItems:
                "stretch",
            }}
          >
            <textarea
              className="textarea"
              value={input}
              onChange={(e) =>
                setInput(
                  e.target.value
                )
              }
              rows={3}
              placeholder="Napisz do BroAI…"
            />

            <select
              className="select"
              value={provider}
              onChange={(e) =>
                setProvider(
                  e.target.value
                )
              }
              style={{
                maxWidth: 150,
              }}
            >
              <option value="openai">
                OpenAI
              </option>

              <option value="anthropic">
                Claude
              </option>

              <option value="grok">
                Grok
              </option>

              <option value="perplexity">
                Perplexity
              </option>

              <option value="gemini">
                Gemini
              </option>
            </select>
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={busy}
            style={{
              minWidth: 96,
            }}
          >
            {busy ? (
              "…"
            ) : (
              <>
                <Send size={16} />
                Wyślij
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
