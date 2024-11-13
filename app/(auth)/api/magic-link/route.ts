import { prisma } from "@/lib/server/db";
import { decrypt } from "@/lib/server/jwt";
import { deleteMagicLink, getMagicLink } from "@/lib/server/magic-link";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/server/session";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const token = searchParams.get("token");

  if (!token) {
    return Response.json(
      {
        error: "Token is not existed",
      },
      { status: 400 }
    );
  }

  const decoded = (await decrypt(token)) as {
    email: string;
    userId: string;
  };

  if (!decoded) {
    return Response.json(
      {
        error: "Token is not valid",
      },
      { status: 400 }
    );
  }

  const magicLink = await getMagicLink(token);

  if (magicLink === null) {
    return Response.json(
      {
        error: "Token is not valid",
      },
      { status: 400 }
    );
  }

  await deleteMagicLink(decoded.userId);

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, decoded.userId);
  await setSessionTokenCookie(sessionToken, session.expiresAt);

  return redirect("/password-reset");
}
