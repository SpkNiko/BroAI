import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { buildSystemPrompt } from "@/lib/ai/prompts";
import {
  pickProvider,
  runChat,
} from "@/lib/ai/router";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request
) {
  const user = await getCurrentUser();

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
    const body = (await request.json()) as {
      mode?:
        | "CHAT"
        | "PROGRAMMER"
        | "LEARN";

      provider?: string;
      model?: string;
      conversationId?: string;

      messages?: Array<{
        role:
          | "user"
          | "assistant";
        content: string;
      }>;
    };

    const mode =
      body.mode ?? "CHAT";

    const messages =
      Array.isArray(body.messages)
        ? body.messages.slice(-30)
        : [];

    const context =
      `User preferences: language=${user.language}, responseStyle=${user.responseStyle}.`;

    const system =
      buildSystemPrompt(
        mode,
        context
      );

    const provider =
      pickProvider(body.provider);

    const result = await runChat({
      provider,
      model: body.model,
      system,
      messages,
    });

    if (body.conversationId) {
      const owned =
        await prisma.conversation.findFirst(
          {
            where: {
              id: body.conversationId,
              userId: user.id,
            },
          }
        );

      if (owned) {
        const latestUser =
          messages.at(-1);

        if (
          latestUser?.role === "user"
        ) {
          await prisma.message.create({
            data: {
              conversationId:
                owned.id,
              role: "USER",
              content:
                latestUser.content,
              provider,
              model: result.model,
            },
          });
        }

        await prisma.message.create({
          data: {
            conversationId:
              owned.id,
            role: "ASSISTANT",
            content: result.content,
            provider,
            model: result.model,
          },
        });
      }
    }

    return NextResponse.json({
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "AI request failed",
      },
      {
        status: 500,
      }
    );
  }
}
