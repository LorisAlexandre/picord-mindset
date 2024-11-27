"server-only";

import { cache } from "react";
import { prisma } from "./db";
import { getCurrentSession } from "./session";
import { Content, Prisma } from "@prisma/client";
import { change$oidToId } from "../functions";
import { revalidatePath } from "next/cache";

export const searchContent = cache(async (query?: string) => {
  await getCurrentSession();

  if (!query) return [];

  const pipeline: { [key: string]: any }[] = [];

  pipeline.push({
    $search: {
      index: "dynamic-content-search",
      compound: {
        should: [
          {
            autocomplete: {
              query,
              path: "properties.title",
              fuzzy: {
                maxEdits: 1,
              },
            },
          },
        ],
        minimumShouldMatch: 1,
      },
    },
  });

  const results = await prisma.content.aggregateRaw({
    pipeline,
  });

  const cleanResults = (results as { [key: string]: any }).map(
    change$oidToId
  ) as Content[];

  return cleanResults;
});

export async function addContentToForm(
  formId: string,
  contentId: string,
  category: string
) {
  const updatedContent = await prisma.content.update({
    where: { id: contentId },
    data: {
      formId,
    },
  });

  return revalidatePath(
    `/admin/categories/${category}/forms/${formId}/actions/link-content`
  );
}

export const getContentByCategory = cache(
  async (category: string, include?: Prisma.ContentInclude) => {
    const content = await prisma.content.findMany({
      where: {
        category: { title: category },
      },
      include,
    });

    return content;
  }
);
