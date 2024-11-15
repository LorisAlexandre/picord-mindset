import { getFormsByCategory } from "@/lib/server/form";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const FormWidget = async ({ category }: { category: string }) => {
  const forms = await getFormsByCategory(category);

  return (
    <div>
      <Link
        prefetch={true}
        href={`/admin/categories/${category}/forms`}
        className="flex items-center justify-center"
      >
        Formulaires <ChevronRight />
      </Link>

      <div>{forms.map((f) => f.title)}</div>
    </div>
  );
};
