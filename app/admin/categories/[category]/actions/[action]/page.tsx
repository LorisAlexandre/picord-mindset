import {
  CategoryDeleteAction,
  CategoryEditAction,
} from "@/components/app-sidebar/category";
import { getCategoryByTitle } from "@/lib/server/category";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

interface Props {
  params: Promise<{ [key: string]: string }>;
}
export default async function CategoryActionPage(props: Props) {
  const params = await props.params;
  const action = params.action;
  const title = decodeURIComponent(params.category).replaceAll("Ã©", "é");

  const category = await getCategoryByTitle(title);

  if (!category) {
    return notFound();
  }

  const renderAction = (action: string): ReactNode => {
    switch (action) {
      case "delete":
        return <CategoryDeleteAction id={category.id} />;
        break;

      case "edit":
        return <CategoryEditAction category={category} />;
      default:
        return null;
        break;
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center">
      {renderAction(action)}
    </main>
  );
}
