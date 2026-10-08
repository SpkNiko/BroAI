import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";

type ImageRequest = {
  prompt?: string;
  size?: string;
  quality?: string;
};

const ALLOWED_SIZES = new Set([
  "1024x1024",
  "1536x1024",
  "1024x1536",
  "auto",
]);

const ALLOWED_QUALITY = new Set([
  "low",
  "medium",
  "high",
]);

export async function POST(
  request: Request
) {
  const user =
    await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const body =
      (await request.json()) as ImageRequest;

    const prompt =
      String(
        body.prompt ?? ""
      ).trim();

    const size =
      String(
        body.size ?? "1024x1024"
      );

    const quality =
      String(
        body.quality ?? "medium"
      );

    if (!prompt) {
      return NextResponse.json(
        {
          error:
            "Prompt obrazu jest wymagany.",
        },
        {
          status: 400,
        }
      );
    }

    if (prompt.length > 10000) {
      return NextResponse.json(
        {
          error:
            "Prompt jest za długi.",
        },
        {
          status: 400,
        }
      );
    }

    if (!ALLOWED_SIZES.has(size)) {
      return NextResponse.json(
        {
          error:
            "Nieprawidłowy rozmiar obrazu.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !ALLOWED_QUALITY.has(
        quality
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Nieprawidłowa jakość obrazu.",
        },
        {
          status: 400,
        }
      );
    }

    const apiKey =
      process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "OPENAI_API_KEY nie jest ustawiony w .env.",
        },
        {
          status: 500,
        }
      );
    }

    const model =
      process.env.OPENAI_IMAGE_MODEL ??
      "gpt-image-2";

    const response =
      await fetch(
        "https://api.openai.com/v1/images/generations",
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
            prompt,
            size,
            quality,
          }),
        }
      );

    if (!response.ok) {
      const text =
        await response.text();

      return NextResponse.json(
        {
          error:
            `OpenAI Image API ${response.status}: ${text.slice(
              0,
              1000
            )}`,
        },
        {
          status: 502,
        }
      );
    }

    const data =
      (await response.json()) as {
        data?: Array<{
          b64_json?: string;
        }>;
      };

    const base64 =
      data.data?.[0]?.b64_json;

    if (!base64) {
      return NextResponse.json(
        {
          error:
            "OpenAI nie zwróciło obrazu.",
        },
        {
          status: 502,
        }
      );
    }

    return NextResponse.json({
      image:
        `data:image/png;base64,${base64}`,
      model,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Image generation failed.",
      },
      {
        status: 500,
      }
    );
  }
}
