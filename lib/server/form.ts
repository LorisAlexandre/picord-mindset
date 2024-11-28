"server-only";

import { AnswerOption, Category, Form, Prisma, Question } from "@prisma/client";
import { cache } from "react";
import { prisma } from "./db";
import { getCurrentSession } from "./session";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { change$oidToId } from "../functions";

export const getFormsByCategory = cache(
  async (
    categoryTitle: string,
    {
      include,
      skip = 0,
      take = 5,
    }: { include?: Prisma.FormInclude; skip?: number; take?: number }
  ) => {
    const forms = await prisma.form.findMany({
      where: { category: { title: categoryTitle } },
      include,
      skip,
      take,
    });

    return forms;
  }
);

type FormWithInclude<TInclude extends (keyof Prisma.FormInclude)[]> = Form & {
  [P in TInclude[number]]: Prisma.FormGetPayload<{
    include: { [K in P]: true };
  }>[];
};
export const getLatestFormsByCategory = cache(
  async <TInclude extends (keyof Prisma.FormInclude)[]>({
    category,
    include,
    start = 0,
    step = 5,
  }: {
    category?: string;
    include: TInclude;
    start?: number;
    step?: number;
  }): Promise<(Category & { form: FormWithInclude<TInclude>[] })[]> => {
    const pipeline: { [key: string]: any }[] = [];

    pipeline.push({
      $lookup: {
        from: "Form",
        localField: "_id",
        foreignField: "categoryId",
        as: "form",
        pipeline: [
          {
            $sort: { "form.createdAt": -1 },
          },
          {
            $limit: step ?? 0,
          },
          {
            $skip: start,
          },
        ],
      },
    });

    if (category) {
      pipeline.push({
        $match: {
          title: category,
        },
      });
    }

    (include ?? []).map((inc) => {
      pipeline.push(
        {
          $lookup: {
            from: inc.charAt(0).toUpperCase() + inc.slice(1),
            localField: "form._id",
            foreignField: "formId",
            as: `${inc}s`,
          },
        },
        {
          $addFields: {
            form: {
              $map: {
                input: "$form",
                as: "form",
                in: {
                  $mergeObjects: [
                    "$$form",
                    {
                      [inc]: {
                        $filter: {
                          input: `$${inc}s`,
                          as: inc,
                          cond: { $eq: [`$$${inc}.formId`, "$$form._id"] },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        }
      );
    });

    const result = (await prisma.category.aggregateRaw({
      pipeline,
    })) as any;

    const cleanResult = result.map(change$oidToId);

    return cleanResult;
  }
);

export const getFormById = cache(
  async (id: string, include?: Prisma.FormInclude) => {
    const form = await prisma.form.findUnique({
      where: { id },
      include,
    });

    return form;
  }
);

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

type QuestionProps = Pick<Question, "qText" | "qType" | "id"> & {
  answerOption: Pick<AnswerOption, "title" /* | "imgUrl" */ | "id">[];
};
type FormProps = Pick<Form, "id" | "title" | "description" | "userId"> & {
  question: QuestionProps[];
};
export async function updateForm(form: FormProps) {
  const { user } = await getCurrentSession();

  if (user.role !== "ADMIN") {
    return redirect("/not-authorized");
  }

  const result = await prisma.$transaction([
    prisma.form.update({
      where: { id: form.id },
      data: {
        title: form.title,
        description: form.description,
      },
      include: {
        category: true,
      },
    }),
    ...form.question.map((q) =>
      prisma.question.upsert({
        where: {
          id: Boolean(new Date(Number(q.id)).valueOf())
            ? ObjectId.createFromTime(new Date(Date.now()).valueOf()).toString()
            : q.id,
        },
        update: {
          formId: form.id,
          qText: q.qText,
          qType: q.qType,
          answerOption: {
            upsert: (q.answerOption ?? []).map((ao) => ({
              where: {
                id: Boolean(new Date(Number(ao.id)).valueOf())
                  ? ObjectId.createFromTime(
                      new Date(Date.now()).valueOf()
                    ).toString()
                  : ao.id,
              },
              update: {
                title: ao.title,
              },
              create: {
                title: ao.title,
                userId: user.id,
              },
            })),
          },
        },
        create: {
          formId: form.id,
          userId: user.id,
          qText: q.qText,
          qType: q.qType,
        },
      })
    ),
  ]);

  return result;
}

export async function changeFormCategory(formId: string, categoryId: string) {
  const updatedForm = await prisma.form.update({
    where: { id: formId },
    data: {
      categoryId,
    },
    include: {
      category: true,
    },
  });

  return updatedForm;
}
