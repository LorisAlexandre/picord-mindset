import {
  FormDeleteAction,
  FormEditAction,
  FormLinkContentAction,
} from "@/components/form";
import { getFormById } from "@/lib/server/form";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

interface Props {
  params: Promise<{ [key: string]: string }>;
}
export default async function FormActionPage(props: Props) {
  const params = await props.params;
  const action = params.action;
  const formId = params.form;

  const form = await getFormById(formId, {
    content: true,
    question: {
      include: {
        answerOption: true,
      },
    },
    category: true,
  });

  if (!form) {
    return notFound();
  }

  const renderAction = (action: string): ReactNode => {
    switch (action) {
      case "delete":
        return <FormDeleteAction id={form.id} />;
      case "edit":
        return <FormEditAction form={form as any} />;
      case "link-content":
        return <FormLinkContentAction form={form as any} />;
      default:
        return null;
    }
  };

  return (
    <main className="flex-1 flex justify-center">{renderAction(action)}</main>
  );
}
