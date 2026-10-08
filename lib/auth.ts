import crypto from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

const SESSION_COOKIE =
  "broai_session";

const SESSION_TTL_MS =
  1000 *
  60 *
  60 *
  24 *
  30;

function hashToken(
  token: string
) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function hashPassword(
  password: string
) {
  return bcrypt.hash(
    password,
    12
  );
}

export async function verifyPassword(
  password: string,
  hash: string
) {
  return bcrypt.compare(
    password,
    hash
  );
}

export async function createSession(
  userId: string
) {
  const token =
    crypto
      .randomBytes(32)
      .toString("hex");

  const tokenHash =
    hashToken(token);

  const expiresAt =
    new Date(
      Date.now() +
        SESSION_TTL_MS
    );

  await prisma.session.create(
    {
      data: {
        tokenHash,
        userId,
        expiresAt,
      },
    }
  );

  const store =
    await cookies();

  store.set(
    SESSION_COOKIE,
    token,
    {
      httpOnly: true,
      secure:
        process.env
          .NODE_ENV ===
        "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    }
  );
}

export async function destroySession() {
  const store =
    await cookies();

  const token =
    store.get(
      SESSION_COOKIE
    )?.value;

  if (token) {
    await prisma.session.deleteMany(
      {
        where: {
          tokenHash:
            hashToken(token),
        },
      }
    );
  }

  store.delete(
    SESSION_COOKIE
  );
}

export async function getCurrentUser() {
  const store =
    await cookies();

  const token =
    store.get(
      SESSION_COOKIE
    )?.value;

  if (!token) {
    return null;
  }

  const session =
    await prisma.session.findUnique(
      {
        where: {
          tokenHash:
            hashToken(token),
        },

        include: {
          user: true,
        },
      }
    );

  if (!session) {
    return null;
  }

  if (
    session.expiresAt <=
    new Date()
  ) {
    await prisma.session.delete(
      {
        where: {
          id: session.id,
        },
      }
    );

    return null;
  }

  return session.user;
}

export async function requireUser() {
  const user =
    await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireApiUser() {
  const user =
    await getCurrentUser();

  if (!user) {
    throw new Error(
      "UNAUTHORIZED"
    );
  }

  return user;
}
