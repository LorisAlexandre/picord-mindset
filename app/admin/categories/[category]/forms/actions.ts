"use server";

import { getCategoryByTitle } from "@/lib/server/category";
import { createForm, deleteForm, getFormById } from "@/lib/server/form";
import { redirect, RedirectType } from "next/navigation";
import { z } from "zod";

const createFormSchema = z.object({
  title: z
    .string({ message: "Le champ doit être renseigné" })
    .min(1, "Le champ est obligatoire")
    .max(64, "Le champ est trop long"),
  category: z
    .string({ message: "Le champ doit être renseigné" })
    .min(1, "Le champ est obligatoire")
    .max(64, "Le champ est trop long"),
});
export async function createFormAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = createFormSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
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
            case "category":
              return "catégorie";
            default:
              return e;
          }
        })
        .join(" et ")}`,
    };
  }

  const { title, category: categoryTitle } = validatedFields.data;

  const category = await getCategoryByTitle(categoryTitle);
  if (category === null) {
    return {
      message: "Aucune catégorie n'a été sélectionnée",
    };
  }

  const newForm = await createForm(title, category.id);

  return redirect(`/admin/categories/${category.title}/forms/${newForm.id}`);
}

const deleteFormSchema = z.object({
  formId: z
    .string({ message: "Le champ doit être renseigné" })
    .min(1, "Le champ est obligatoire")
    .max(64, "Le champ est trop long"),
  id: z
    .string({ message: "Le champ doit être renseigné" })
    .min(1, "Le champ est obligatoire")
    .max(64, "Le champ est trop long"),
  category: z
    .string({ message: "Le champ doit être renseigné" })
    .min(1, "Le champ est obligatoire")
    .max(64, "Le champ est trop long"),
});
export async function deleteFormAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = deleteFormSchema.safeParse({
    formId: formData.get("formId"),
    id: formData.get("id"),
    category: formData.get("category"),
  });

  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      message: `Vérifiez le(s) champ(s) ${Object.keys(
        validatedFields.error.flatten().fieldErrors
      )
        .map((e) => {
          switch (e) {
            case "formId":
              return "identifiant";
            case "category":
              return "catégorie";
            default:
              return e;
          }
        })
        .join(" et ")}`,
    };
  }

  const { formId, id, category } = validatedFields.data;

  const form = await getFormById(id);

  if (formId !== form?.id) {
    return {
      message: "L'identifiant ne correspond pas",
    };
  }

  await deleteForm(id);

  return redirect(`/admin/categories/${category}/forms`);
}

type FormState = {
  message: string;
  fieldErrors?: {
    [key: string]: string[] | undefined;
  };
};
