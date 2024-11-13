"server-only";

import { jwtVerify } from "jose";

const key = process.env.JWT_SECRET;
export const JWT_SECRET_KEY = new TextEncoder().encode(key);

export async function decrypt(token: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_KEY, {
      algorithms: ["HS256"],
    });

    return payload;
  } catch (error) {
    return null;
  }
}
