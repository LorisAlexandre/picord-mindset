import { getFormsByCategory } from "@/lib/server/form";
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
import { Form, Question } from "@prisma/client";

export const FormWidget = async ({ category }: { category: string }) => {
  const forms = await getFormsByCategory(category, {
    include: {
      question: true,
      content: true,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 w-full items-start">
        <Link
          prefetch={true}
          href={`/admin/forms?category=${category}`}
          className="flex items-center justify-center"
        >
          Formulaires <ChevronRight />
        </Link>
        <Separator />
      </div>

      <ul className="flex flex-wrap w-full gap-8 overflow-y-auto max-h-[80vh]">
        {forms.map((f) => (
          <li key={`form-${f.id}`} className="w-full max-w-64">
            <Card key={`form-${f.id}`} className="w-full">
              <CardHeader className="flex-row items-center justify-between gap-4 space-y-0 w-full pb-0">
                <Button variant={"link"} size={"link"} asChild>
                  <Link prefetch={true} href={`/admin/forms/${f.id}`}>
                    <CardTitle className="flex items-center justify-center gap-1">
                      {f.title} <ChevronRight />
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
                          href={`/admin/forms/${f.id}/actions/edit`}
                        >
                          Modifier
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link
                          prefetch={true}
                          href={`/admin/forms/${f.id}/actions/delete`}
                        >
                          Supprimer
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardDescription>
              </CardHeader>
              <CardFooter className="text-muted-foreground text-xs">
                Question(s) lié(s):{" "}
                {(f as Form & { question: Question[] }).question.length}
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
};
