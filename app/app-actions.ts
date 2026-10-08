"use server";

import { redirect } from "next/navigation";

import {
  destroySession,
  requireUser,
} from "@/lib/auth";

import { prisma } from "@/lib/prisma";

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

export async function updatePreferences(
  formData: FormData
) {
  const user =
    await requireUser();

  const language =
    String(
      formData.get("language") ??
        "pl"
    ).slice(0, 10);

  const responseStyle =
    String(
      formData.get(
        "responseStyle"
      ) ?? "balanced"
    ).slice(0, 30);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      language,
      responseStyle,
    },
  });

  redirect(
    "/app/settings?saved=1"
  );
}
