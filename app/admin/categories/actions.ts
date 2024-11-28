"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createCategory,
  deleteCategory,
  editCategory,
  getCategoryById,
} from "@/lib/server/category";

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

  return redirect(`/admin/categories/${newCategory.title}`);
}

const deleteCategorySchema = z.object({
  title: z
    .string({ message: "Le champ doit être renseigné" })
    .min(1, "Le champ est obligatoire")
    .max(64, "Le champ est trop long"),
  id: z
    .string({ message: "Le champ doit être renseigné" })
    .min(1, "Le champ est obligatoire"),
});
export async function deleteCategoryAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = deleteCategorySchema.safeParse({
    title: formData.get("title"),
    id: formData.get("id"),
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
            default:
              return e;
          }
        })
        .join(" et ")}`,
    };
  }

  const { title, id } = validatedFields.data;

  const category = await getCategoryById(id);

  if (title !== category?.title) {
    return {
      message: "Le titre ne correspond pas",
    };
  }

  await deleteCategory(id);

  return redirect("/admin/categories");
}

const editCategorySchema = z.object({
  title: z
    .string({ message: "Le champ doit être renseigné" })
    .min(1, "Le champ est obligatoire")
    .max(64, "Le champ est trop long"),
  isPublic: z.boolean().default(false),
  id: z
    .string({ message: "Le champ doit être renseigné" })
    .min(1, "Le champ est obligatoire"),
});
export async function editCategoryAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = editCategorySchema.safeParse({
    title: formData.get("title"),
    isPublic: formData.get("isPublic") === "true",
    id: formData.get("id"),
  });

  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      message: `Vérifiez le(s) champ(s) ${Object.keys(
        validatedFields.error.flatten().fieldErrors
      ).map((e) => {
        switch (e) {
          case "title":
            return "titre";
          case "isPublic":
            return "visibilité";
          default:
            return e;
        }
      })}`,
    };
  }

  const { id, ...data } = validatedFields.data;

  await editCategory(id, {
    ...data,
    isPublic: data.isPublic ? new Date(Date.now()) : null,
  });

  revalidatePath("/admin");
  return redirect(`/admin/categories/${data.title}/actions/edit`);
}

interface FormState {
  message: string;
  fieldErrors?: {
    [key: string]: string[] | undefined;
  };
}
