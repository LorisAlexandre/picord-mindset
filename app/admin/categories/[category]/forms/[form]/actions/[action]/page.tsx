import {
  CategoryDeleteAction,
  CategoryEditAction,
} from "@/components/app-sidebar/category";
import { FormDeleteAction } from "@/components/form";
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

  const form = await getFormById(formId);

  if (!form) {
    return notFound();
  }

  const renderAction = (action: string): ReactNode => {
    switch (action) {
      case "delete":
        return <FormDeleteAction id={form.id} />;

      case "edit":
        return <div>Edit form</div>;
      // return <FormEditAction category={form} />;
      default:
        return null;
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center">
      {renderAction(action)}
    </main>
  );
}
