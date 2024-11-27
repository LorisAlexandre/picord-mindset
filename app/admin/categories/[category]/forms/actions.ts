"use server";

import { getCategoryByTitle } from "@/lib/server/category";
import {
  createForm,
  deleteForm,
  getFormById,
  updateForm,
} from "@/lib/server/form";
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

const answerOptionSchema = z.object({
  title: z
    .string({ message: "Le champ doit être renseigné" })
    .min(1, "Le champ est obligatoire"),
  id: z
    .string({ message: "Le champ doit être renseigné" })
    .min(1, "Le champ est obligatoire"),
});
const questionSchema = z.object({
  qText: z
    .string({ message: "Le champ doit être renseigné" })
    .min(1, "Le champ est obligatoire"),
  qType: z.enum(
    ["text", "long-text", "number", "single-choice", "multiple-choice"],
    {
      message: `Vous devez choisir entre ${[
        "texte",
        "long-texte",
        "nombre",
        "choix unique",
        "choix-multiple",
      ].join(" ou ")}`,
    }
  ),
  id: z
    .string({ message: "Le champ doit être renseigné" })
    .min(1, "Le champ est obligatoire"),
  answerOption: z.array(answerOptionSchema),
});
const updateFormSchema = z.object({
  id: z
    .string({ message: "Le champ doit être renseigné" })
    .min(1, "Le champ est obligatoire"),
  userId: z
    .string({ message: "Le champ doit être renseigné" })
    .min(1, "Le champ est obligatoire"),
  title: z
    .string({ message: "Le champ doit être renseigné" })
    .min(1, "Le champ est obligatoire"),
  description: z.string().nullable(),
  question: z.array(questionSchema).min(1, "Une question est nécessaire"),
});
export async function updateFormAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const editingForm = JSON.parse(formData.get("editingForm") as string);

  const validatedFields = updateFormSchema.safeParse(editingForm);

  if (!validatedFields.success) {
    const fieldErrors: {
      [key: string]: string[] | undefined;
    } = {};

    validatedFields.error.errors.map((e) => {
      fieldErrors[e.path.map(String).join(",")] = [
        ...(fieldErrors[e.path.map(String).join(",")] ?? ""),
        e.message,
      ];
    });

    console.log(fieldErrors);

    return {
      fieldErrors,
      message: `${Object.keys(validatedFields.error.flatten().fieldErrors).map(
        (e) => e
      )}`,
    };
  }

  const form = validatedFields.data;

  const [updatedForm, ..._result] = await updateForm(form);

  return redirect(
    `/admin/categories/${updatedForm.category.title}/forms/${form.id}`
  );
}

type FormState = {
  message: string;
  fieldErrors?: {
    [key: string]: string[] | undefined;
  };
};
