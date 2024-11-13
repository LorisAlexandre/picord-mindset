"server-only";

import { SignJWT } from "jose";
import { JWT_SECRET_KEY } from "./jwt";
import { prisma } from "./db";
import { BASE_URL } from "../url";
import { MagicLink } from "@prisma/client";

export async function generateMagicLink(email: string, userId: string) {
  const token = await new SignJWT({ email, userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(JWT_SECRET_KEY);

  await prisma.magicLink.create({
    data: {
      expiresAt: new Date(Date.now() + 60 * 60),
      token,
      userId,
    },
  });

  // Send email
}

export async function getMagicLink(token: string): Promise<MagicLink | null> {
  const magicLink = await prisma.magicLink.findUnique({
    where: { token },
  });

  return magicLink;
}

export async function deleteMagicLink(userId: string): Promise<void> {
  await prisma.magicLink.deleteMany({
    where: {
      userId,
    },
  });
}
