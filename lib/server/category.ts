"server-only";

import { Category, Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "./db";
import { getCurrentSession } from "./session";
import { cache } from "react";

export const getCategories = cache(async (include?: Prisma.CategoryInclude) => {
  const categories = await prisma.category.findMany({
    include,
  });

  return categories;
});

export const getCategoryById = cache(
  async (id: string): Promise<Category | null> => {
    const category = await prisma.category.findUnique({
      where: {
        id,
      },
    });

    return category;
  }
);

export const getCategoryByTitle = cache(
  async (title: string): Promise<Category | null> => {
    const category = await prisma.category.findUnique({
      where: {
        title,
      },
    });

    return category;
  }
);

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

export async function deleteCategory(id: string): Promise<void> {
  const { user } = await getCurrentSession();

  if (user.role !== "ADMIN") {
    return redirect("/not-authorized");
  }

  await prisma.category.delete({
    where: {
      id,
    },
  });
}

export async function editCategory(
  id: string,
  data: Pick<Category, "title" | "isPublic">
): Promise<Category> {
  const { user } = await getCurrentSession();

  if (user.role !== "ADMIN") {
    return redirect("/not-authorized");
  }

  const updatedCategory = await prisma.category.update({
    where: {
      id,
    },
    data,
  });

  return updatedCategory;
}
