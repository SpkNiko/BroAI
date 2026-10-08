type Provider =
  | "openai"
  | "anthropic"
  | "grok"
  | "perplexity"
  | "gemini";

export type ChatInput = {
  provider?: Provider;
  model?: string;
  system: string;

  messages: Array<{
    role:
      | "user"
      | "assistant";
    content: string;
  }>;
};

export function pickProvider(
  requested?: string
): Provider {
  const value =
    requested?.toLowerCase();

  if (
    value === "anthropic" ||
    value === "claude"
  ) {
    return "anthropic";
  }

  if (
    value === "grok" ||
    value === "xai"
  ) {
    return "grok";
  }

  if (
    value === "perplexity"
  ) {
    return "perplexity";
  }

  if (
    value === "gemini" ||
    value === "google"
  ) {
    return "gemini";
  }

  return "openai";
}

async function openAICompatible(
  baseUrl: string,
  apiKey: string,
  model: string,
  system: string,
  messages: ChatInput["messages"]
) {
  const response =
    await fetch(
      `${baseUrl.replace(
        /\/$/,
        ""
      )}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Authorization:
            `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content: system,
            },
            ...messages,
          ],
          temperature: 0.7,
        }),
      }
    );

  if (!response.ok) {
    const text =
      await response.text();

    throw new Error(
      `Provider error ${response.status}: ${text.slice(
        0,
        500
      )}`
    );
  }

  const data =
    (await response.json()) as {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
    };

  return (
    data.choices?.[0]?.message
      ?.content ??
    "Nie otrzymałem odpowiedzi od modelu."
  );
}

async function anthropic(
  apiKey: string,
  model: string,
  system: string,
  messages: ChatInput["messages"]
) {
  const response =
    await fetch(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          "x-api-key":
            apiKey,
          "anthropic-version":
            "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: 4096,
          system,
          messages:
            messages.map(
              (m) => ({
                role: m.role,
                content:
                  m.content,
              })
            ),
        }),
      }
    );

  if (!response.ok) {
    const text =
      await response.text();

    throw new Error(
      `Anthropic error ${response.status}: ${text.slice(
        0,
        500
      )}`
    );
  }

  const data =
    (await response.json()) as {
      content?: Array<{
        type?: string;
        text?: string;
      }>;
    };

  return (
    data.content
      ?.filter(
        (item) =>
          item.type === "text"
      )
      .map(
        (item) =>
          item.text ?? ""
      )
      .join("\n") ||
    "Nie otrzymałem odpowiedzi od modelu."
  );
}

async function gemini(
  apiKey: string,
  model: string,
  system: string,
  messages: ChatInput["messages"]
) {
  const response =
    await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        model
      )}:generateContent?key=${encodeURIComponent(
        apiKey
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: system,
              },
            ],
          },

          contents:
            messages.map(
              (m) => ({
                role:
                  m.role ===
                  "assistant"
                    ? "model"
                    : "user",

                parts: [
                  {
                    text:
                      m.content,
                  },
                ],
              })
            ),
        }),
      }
    );

  if (!response.ok) {
    const text =
      await response.text();

    throw new Error(
      `Gemini error ${response.status}: ${text.slice(
        0,
        500
      )}`
    );
  }

  const data =
    (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{
            text?: string;
          }>;
        };
      }>;
    };

  return (
    data.candidates?.[0]
      ?.content?.parts
      ?.map(
        (part) =>
          part.text ?? ""
      )
      .join("\n") ||
    "Nie otrzymałem odpowiedzi od modelu."
  );
}

export async function runChat(
  input: ChatInput
) {
  const provider =
    input.provider ??
    "openai";

  if (
    provider ===
    "anthropic"
  ) {
    const key =
      process.env
        .ANTHROPIC_API_KEY;

    if (!key) {
      return {
        provider,
        model:
          input.model ??
          process.env
            .ANTHROPIC_MODEL ??
          "anthropic",

        content:
          demoResponse(),
      };
    }

    const model =
      input.model ??
      process.env
        .ANTHROPIC_MODEL ??
      "claude";

    return {
      provider,
      model,
      content:
        await anthropic(
          key,
          model,
          input.system,
          input.messages
        ),
    };
  }

  if (
    provider ===
    "gemini"
  ) {
    const key =
      process.env
        .GEMINI_API_KEY;

    if (!key) {
      return {
        provider,
        model:
          input.model ??
          process.env
            .GEMINI_MODEL ??
          "gemini",

        content:
          demoResponse(),
      };
    }

    const model =
      input.model ??
      process.env
        .GEMINI_MODEL ??
      "gemini";

    return {
      provider,
      model,
      content:
        await gemini(
          key,
          model,
          input.system,
          input.messages
        ),
    };
  }

  const configs: Record<
    "openai" |
      "grok" |
      "perplexity",
    {
      key?: string;
      baseUrl: string;
      model: string;
    }
  > = {
    openai: {
      key:
        process.env
          .OPENAI_API_KEY,

      baseUrl:
        process.env
          .OPENAI_BASE_URL ??
        "https://api.openai.com/v1",

      model:
        process.env
          .OPENAI_MODEL ??
        "gpt-5.6",
    },

    grok: {
      key:
        process.env
          .GROK_API_KEY,

      baseUrl:
        process.env
          .GROK_BASE_URL ??
        "https://api.x.ai/v1",

      model:
        process.env
          .GROK_MODEL ??
        "grok",
    },

    perplexity: {
      key:
        process.env
          .PERPLEXITY_API_KEY,

      baseUrl:
        "https://api.perplexity.ai",

      model:
        process.env
          .PERPLEXITY_MODEL ??
        "sonar",
    },
  };

  const config =
    configs[provider];

  if (!config.key) {
    return {
      provider,
      model:
        input.model ??
        config.model,

      content:
        demoResponse(),
    };
  }

  const model =
    input.model ??
    config.model;

  return {
    provider,
    model,

    content:
      await openAICompatible(
        config.baseUrl,
        config.key,
        model,
        input.system,
        input.messages
      ),
  };
}

function demoResponse() {
  return "BroAI jest już podłączone. Dodaj klucz wybranego dostawcy AI w .env, aby włączyć prawdziwe odpowiedzi modelu.";
}
