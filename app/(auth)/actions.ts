"use server";

import { hash, verify } from "@node-rs/argon2";
import {
  createSession,
  deleteSessionTokenCookie,
  generateSessionToken,
  getCurrentSession,
  invalidateSession,
  setSessionTokenCookie,
} from "@/lib/server/session";
import { getUserFromEmail } from "@/lib/server/user";
import { redirect } from "next/navigation";
import { z } from "zod";
import { generateMagicLink } from "@/lib/server/magic-link";
import { prisma } from "@/lib/server/db";

const loginSchema = z.object({
  email: z
    .string({ message: "Le champ doit être un email" })
    .email("Le champ doit être un email")
    .min(1, "Le champ est obligatoire")
    .max(256, "Le champ est trop long"),
  password: z
    .string({ message: "Le champ doit être du texte" })
    .min(1, "Le champ est obligatoire")
    .max(256, "Le champ est trop long"),
  callbackUrl: z.string().optional(),
});
export async function loginAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    callbackUrl: formData.get("callbackUrl"),
  });

  const { success } = validatedFields;
  if (!success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      message: `Vérifiez le(s) champ(s) ${Object.keys(
        validatedFields.error.flatten().fieldErrors
      )
        .map((e) => {
          switch (e) {
            case "password":
              return "mot de passe";
            default:
              return e;
          }
        })
        .join(" et ")}`,
    };
  }

  const { email, password, callbackUrl } = validatedFields.data;

  const user = await getUserFromEmail(email);
  if (user === null) {
    return {
      message: "Ce compte n'existe pas",
    };
  }

  const passHash = user.password;
  if (!passHash) {
    return {
      message: `Les identifiants de connexion fournis sont incorrects.
    Si vous avez oublié votre mot de passe, utilisez l'option « Mot de passe oublié » pour le réinitialiser.
    `,
    };
  }
  // verify hash
  const match = await verify(passHash, password);
  if (!match) {
    return {
      message: `Les identifiants de connexion fournis sont incorrects.
    Si vous avez oublié votre mot de passe, utilisez l'option « Mot de passe oublié » pour le réinitialiser.
    `,
    };
  }

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  await setSessionTokenCookie(sessionToken, session.expiresAt);

  if (!callbackUrl || !callbackUrl.includes("/")) {
    if (user.role === "ADMIN") {
      return redirect("/admin");
    }

    return redirect("/mon-compte");
  }

  return redirect(callbackUrl);
}

const signupSchema = z.object({
  email: z
    .string({ message: "Le champ doit être un email" })
    .email("Le champ doit être un email")
    .min(1, "Le champ est obligatoire")
    .max(256, "Le champ est trop long"),
  name: z
    .string({ message: "Le champ doit être renseigné" })
    .min(1, "Le champ est obligatoire")
    .max(32, "Le champ est trop long"),
  callbackUrl: z.string().optional(),
});
export async function signupAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = signupSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    callbackUrl: formData.get("callbackUrl"),
  });

  const { success } = validatedFields;
  if (!success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      message: `Vérifiez le(s) champ(s) ${Object.keys(
        validatedFields.error.flatten().fieldErrors
      )
        .map((e) => {
          switch (e) {
            case "name":
              return "nom";
              break;
            default:
              return e;
              break;
          }
        })
        .join(" et ")}`,
    };
  }

  const { email, name } = validatedFields.data;

  const user = await getUserFromEmail(email);
  if (user !== null) {
    return {
      message: "Cet email est déjà utilisé",
    };
  }

  const newUser = await prisma.user.create({
    data: {
      email,
      name,
    },
  });

  await generateMagicLink(email, newUser.id);

  return redirect(`/signup/verify-email?email=${email}`);
}

const passwordResetSchema = z.object({
  password: z
    .string({ message: "Le champ doit être du texte" })
    .min(1, "Le champ est obligatoire")
    .max(256, "Le champ est trop long"),
  confirmPassword: z
    .string({ message: "Le champ doit être du texte" })
    .min(1, "Le champ est obligatoire")
    .max(256, "Le champ est trop long"),
});
export async function passwordResetAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = passwordResetSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      message: `Vérifiez les champs ${Object.keys(
        validatedFields.error.flatten().fieldErrors
      )
        .map((e) => {
          switch (e) {
            case "password":
              return "mot de passe";
            case "confirmPassword":
              return "confirmation du mot de passe";
            default:
              return e;
          }
        })
        .join(" et ")}`,
    };
  }

  const { confirmPassword, password } = validatedFields.data;

  if (confirmPassword !== password) {
    return {
      message: "Les mots de passes ne sont pas identiques",
    };
  }

  const { user } = await getCurrentSession();

  const passHash = await hash(password);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: passHash,
    },
  });

  return redirect("/mon-compte");
}

export async function logoutAction() {
  const { session } = await getCurrentSession();
  await invalidateSession(session.id);
  await deleteSessionTokenCookie();

  return redirect("/");
}

type FormState = {
  message: string;
  fieldErrors?: { [key: string]: string[] | undefined };
};
