import { ContentWidget } from "@/components/content";
import { FormWidget } from "@/components/form";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
} from "@/components/shadcn/ui";
import { SquarePen, Trash2 } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ [key: string]: string }>;
}
export default async function CategoryPage(props: Props) {
  const params = await props.params;
  const category = decodeURIComponent(params.category).replaceAll("Ã©", "é");

  return (
    <main className="flex-1">
      <Card variant={"ghost"} className="size-full flex flex-col">
        <div className="pb-2 sticky top-4">
          <div className="flex items-center justify-between px-6 pb-2">
            <CardHeader className="p-0">
              <CardTitle className="text-xl">{category}</CardTitle>
            </CardHeader>
            <CardFooter className="p-0 gap-2">
              <Button variant={"secondary"} asChild>
                <Link href={`/admin/categories/${category}/actions/edit`}>
                  <SquarePen /> Modifier
                </Link>
              </Button>
              <Button variant={"destructive"} asChild>
                <Link href={`/admin/categories/${category}/actions/delete`}>
                  <Trash2 /> Supprimer
                </Link>
              </Button>
            </CardFooter>
          </div>
          <Separator />
        </div>
        <CardContent className="flex-1 pt-12 font-semibold grid grid-cols-2 gap-x-4">
          <ContentWidget category={category} />
          <FormWidget category={category} />
        </CardContent>
      </Card>
    </main>
  );
}
