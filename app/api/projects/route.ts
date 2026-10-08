import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
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

  const projects =
    await prisma.project.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

  return NextResponse.json({
    projects,
  });
}

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

  const body =
    (await request.json()) as {
      name?: string;
      description?: string;
      engine?: string;
    };

  const name =
    String(
      body.name ?? ""
    ).trim();

  if (
    name.length < 2 ||
    name.length > 80
  ) {
    return NextResponse.json(
      {
        error:
          "Nazwa musi mieć 2–80 znaków.",
      },
      {
        status: 400,
      }
    );
  }

  const project =
    await prisma.project.create({
      data: {
        userId: user.id,
        name,
        description:
          String(
            body.description ?? ""
          ).slice(0, 500),
        engine:
          String(
            body.engine ?? ""
          ).slice(0, 30),
      },
    });

  return NextResponse.json({
    id: project.id,
  });
}
