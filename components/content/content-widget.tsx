import { getContentByCategory } from "@/lib/server/content";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const ContentWidget = async ({ category }: { category: string }) => {
  const content = await getContentByCategory(category);

  return (
    <div>
      <Link
        prefetch={true}
        href={`/admin/categories/${category}/content`}
        className="flex items-center justify-center"
      >
        Contenus <ChevronRight />
      </Link>

      <div>{content.map((c) => c.properties.title)}</div>
    </div>
  );
};
