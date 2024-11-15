"server-only";

import { Form, Prisma } from "@prisma/client";
import { cache } from "react";
import { prisma } from "./db";
import { getCurrentSession } from "./session";
import { redirect } from "next/navigation";

export const getFormsByCategory = cache(
  async (categoryTitle: string, include?: (keyof Prisma.FormInclude)[]) => {
    const cleanInclude: { [k: string]: boolean } = {};

    (include ?? [])?.map((k) => (cleanInclude[k] = true));

    const forms = await prisma.form.findMany({
      where: { category: { title: categoryTitle } },
      include: cleanInclude,
    });

    return forms;
  }
);

export const getFormById = cache(async (id: string): Promise<Form | null> => {
  const form = await prisma.form.findUnique({
    where: { id },
  });

  return form;
});

export async function createForm(
  title: string,
  categoryId: string
): Promise<Form> {
  const { user } = await getCurrentSession();

  if (user.role !== "ADMIN") {
    return redirect("/not-authorized");
  }

  const newForm = await prisma.form.create({
    data: {
      title,
      userId: user.id,
      categoryId,
    },
  });

  return newForm;
}

export async function deleteForm(id: string): Promise<void> {
  const { user } = await getCurrentSession();

  if (user.role !== "ADMIN") {
    return redirect("/not-authorized");
  }

  await prisma.form.delete({
    where: { id },
  });
}
