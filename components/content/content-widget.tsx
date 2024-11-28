import { getContentByCategory } from "@/lib/server/content";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Separator,
} from "@/components/shadcn/ui";

export const ContentWidget = async ({ category }: { category: string }) => {
  const contents = await getContentByCategory(category);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 w-full items-start">
        <Link
          prefetch={true}
          href={`/admin/content?category=${category}`}
          className="flex items-center justify-center"
        >
          Contenu <ChevronRight />
        </Link>
        <Separator />
      </div>

      <ul className="flex flex-wrap w-full gap-8 overflow-y-auto max-h-[80vh]">
        {contents.map((content) => (
          <li key={`content-${content.id}`} className="w-full max-w-64">
            <Card key={`content-${content.id}`} className="w-full">
              <CardHeader className="flex-row items-center justify-between gap-4 space-y-0 w-full pb-0">
                <Button variant={"link"} size={"link"} asChild>
                  <Link prefetch={true} href={`/admin/content/${content.id}`}>
                    <CardTitle className="flex items-center justify-center gap-1">
                      {content.properties.title} <ChevronRight />
                    </CardTitle>
                  </Link>
                </Button>

                <CardDescription>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="relative">
                      <div className="absolute right-1 flex aspect-square w-6 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-5 [&>svg]:shrink-0">
                        <MoreHorizontal />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side="right"
                      align="start"
                      className="space-y-1"
                    >
                      <DropdownMenuItem>
                        <Link
                          prefetch={true}
                          href={`/admin/content/${content.id}/actions/edit`}
                        >
                          Modifier
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link
                          prefetch={true}
                          href={`/admin/content/${content.id}/actions/delete`}
                        >
                          Supprimer
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardDescription>
              </CardHeader>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
};
