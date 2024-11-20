"server-only";

import { AnswerOption, Form, Prisma, Question } from "@prisma/client";
import { cache } from "react";
import { prisma } from "./db";
import { getCurrentSession } from "./session";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";

export const getFormsByCategory = cache(
  async (categoryTitle: string, include?: Prisma.FormInclude) => {
    const forms = await prisma.form.findMany({
      where: { category: { title: categoryTitle } },
      include,
    });

    return forms;
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
