import { FormCreateAction } from "@/components/form";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/shadcn/ui";
import { getFormsByCategory } from "@/lib/server/form";
import { Form, Question } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ [key: string]: string }>;
}
export default async function FormsPage(props: Props) {
  const params = await props.params;
  const category = params.category;
  const forms = await getFormsByCategory(category, {
    question: true,
  });

  return (
    <main className="flex-1 flex pt-4 px-2">
      <Card className="flex-1 flex flex-col" variant={"ghost"}>
        <div className="flex items-center justify-between px-6 pb-2">
          <CardHeader className="p-0">
            <CardTitle>Suivis</CardTitle>
            {/* <CardDescription></CardDescription> */}
          </CardHeader>
          <CardFooter className="p-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Créer un formulaire</Button>
              </DialogTrigger>
              <FormCreateAction />
            </Dialog>
          </CardFooter>
        </div>
        <Separator />
        <CardContent className="pt-3 px-0 flex flex-wrap gap-4">
          {forms.length > 0 ? (
            forms.map((f) => (
              <Card key={f.id} className="max-w-80 w-full">
                <CardHeader className="flex-row items-center justify-between gap-4 space-y-0 w-full">
                  <CardTitle>{f.title}</CardTitle>
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
                            href={`/admin/categories/${category}/forms/${f.id}/actions/edit`}
                          >
                            Modifier
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link
                            prefetch={true}
                            href={`/admin/categories/${category}/forms/${f.id}/actions/delete`}
                          >
                            Supprimer
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {(f as Form & { question: Question[] }).question.length}{" "}
                  question(s)
                </CardContent>
                {/* <CardFooter>
                  <Button asChild>
                    <Link
                      prefetch={true}
                      href={`/admin/categories/${category}/forms/${f.id}/edit`}
                    >
                      Edit
                    </Link>
                  </Button>
                </CardFooter> */}
              </Card>
            ))
          ) : (
            <p>Aucun form</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
