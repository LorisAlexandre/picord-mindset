"server-only";

import { prisma } from "./db";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { cookies } from "next/headers";
import { cache } from "react";
import { Session, User } from "@prisma/client";
import { redirect } from "next/navigation";

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(
  token: string,
  userId: string
): Promise<Session> {
  const sessionToken = encodeHexLowerCase(
    sha256(new TextEncoder().encode(token))
  );
  const session: Omit<Session, "id"> = {
    token: sessionToken,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };
  const newSession = await prisma.session.create({
    data: session,
  });
  return newSession;
}

export async function validateSessionToken(
  token: string
): Promise<SessionValidationResult> {
  const sessionToken = encodeHexLowerCase(
    sha256(new TextEncoder().encode(token))
  );

  const result = await prisma.session.findUnique({
    where: {
      token: sessionToken,
    },
    include: {
      user: true,
    },
  });

  if (result === null) {
    return { session: null, user: null };
  }

  const { user, ...session } = result;

  if (Date.now() >= session.expiresAt.getTime()) {
    await prisma.session.delete({ where: { id: session.id } });
    return { session: null, user: null };
  }

  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        expiresAt: session.expiresAt,
      },
    });
  }

  return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await prisma.session.delete({ where: { id: sessionId } });
}

export async function setSessionTokenCookie(
  token: string,
  expiresAt: Date
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function deleteSessionTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

export const getCurrentSession = cache(
  async (callbackUrl?: string): Promise<SessionValidatedResult> => {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value ?? null;
    let url = "/login";

    if (callbackUrl && callbackUrl.includes("/")) {
      url += `?callbackUrl=${callbackUrl}`;
    }

    if (token === null) {
      return redirect(url);
    }

    const { session, user } = await validateSessionToken(token);

    if (!session || !user) {
      return redirect(url);
    }

    return { session, user };
  }
);

type SessionValidatedResult = { session: Session; user: User };
type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
