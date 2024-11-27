import { ContentWidget } from "@/components/content";
import { FormWidget } from "@/components/form";
import { Separator } from "@/components/shadcn/ui";

interface Props {
  params: Promise<{ [key: string]: string }>;
}
export default async function CategoryPage(props: Props) {
  const params = await props.params;
  const category = params.category;

  return (
    <main className="flex-1">
      <div className="flex-1 flex flex-col gap-8 pt-4">
        <div>
          <h1 className="text-lg font-semibold">{category}</h1>
          <Separator />
        </div>

        <div className="flex-1 flex flex-wrap gap-8">
          <ContentWidget category={category} />
          <FormWidget category={category} />
        </div>
      </div>
    </main>
  );
}
