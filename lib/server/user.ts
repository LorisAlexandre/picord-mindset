"server-only";

import { User } from "@prisma/client";
import { prisma } from "./db";

export async function getUserFromEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user;
}
