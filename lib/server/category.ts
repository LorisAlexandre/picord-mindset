"server-only";

import { Category } from "@prisma/client";
import { cache } from "react";
import { redirect } from "next/navigation";
import { prisma } from "./db";
import { getCurrentSession } from "./session";

export const getCategories = cache(async (): Promise<Category[]> => {
  const categories = await prisma.category.findMany();

  return categories;
});

export async function createCategory(title: string): Promise<Category> {
  const { user } = await getCurrentSession();

  if (user.role !== "ADMIN") {
    return redirect("/not-authorized");
  }

  const newCategory = await prisma.category.create({
    data: {
      title,
      userId: user.id,
    },
  });

  return newCategory;
}
