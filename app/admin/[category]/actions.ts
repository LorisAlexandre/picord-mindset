"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createCategory } from "@/lib/server/category";

const createCategorySchema = z.object({
  title: z
    .string({ message: "Le champ doit être renseigné" })
    .min(1, "Le champ est obligatoire")
    .max(64, "Le champ est trop long"),
});
export async function createCategoryAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = createCategorySchema.safeParse({
    title: formData.get("title"),
  });

  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      message: `Vérifiez le(s) champ(s) ${Object.keys(
        validatedFields.error.flatten().fieldErrors
      )
        .map((e) => {
          switch (e) {
            case "title":
              return "titre";
              break;
            default:
              return e;
              break;
          }
        })
        .join(" et ")}`,
    };
  }

  const { title } = validatedFields.data;

  const newCategory = await createCategory(title);
  revalidatePath("/admin");

  return redirect(`/admin/${newCategory.title}`);
}

interface FormState {
  message: string;
  fieldErrors?: {
    [key: string]: string[] | undefined;
  };
}
