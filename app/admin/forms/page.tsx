import { FormCreateAction } from "@/components/form";
import { PreviousBtn } from "@/components/previous-btn";
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
  DialogTrigger,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/shadcn/ui";
import { getLatestFormsByCategory } from "@/lib/server/form";
import { cn } from "@/lib/utils";
import { ChevronRight, Ellipsis, MoreHorizontal } from "lucide-react";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
export default async function FormsPage(props: Props) {
  const searchParams = await props.searchParams;
  const category = searchParams.category as string;
  const start = searchParams.start as string;

  const categories = await getLatestFormsByCategory({
    category,
    include: ["question"],
    start: !!Number(start) ? Number(start) : 0,
  });

  return (
    <main className="flex-1 flex pt-4 px-2 max-h-screen">
      <Card className="flex-1 flex flex-col max-h-[85vh]" variant={"ghost"}>
        <div className="flex items-center justify-between px-6 pb-2">
          <CardHeader className="p-0">
            <CardTitle>Formulaires</CardTitle>
          </CardHeader>
          <CardFooter className="p-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Créer un formulaire</Button>
              </DialogTrigger>
              <FormCreateAction categories={categories} />
            </Dialog>
          </CardFooter>
        </div>
        <Separator />
        <CardContent
          className={cn(
            "p-4 grid lg:grid-cols-2 grid-cols-1 gap-8 bg-muted/20 overflow-y-scroll max-h-full",
            category && "lg:grid-cols-1"
          )}
        >
          {categories.length > 0 ? (
            categories.map((cat) => (
              <Card
                variant={"ghost"}
                key={cat.id}
                className="w-full bg-card shadow-sm"
              >
                <CardHeader className="flex-row-reverse items-center justify-end gap-4 w-full">
                  <CardTitle>
                    <Button variant={"link"} size={"link"} asChild>
                      <Link
                        prefetch={true}
                        href={`/admin/forms?category=${cat.title}&start=0`}
                      >
                        {cat.title} <ChevronRight />
                      </Link>
                    </Button>
                  </CardTitle>

                  {category && (
                    <>
                      <Separator
                        orientation="vertical"
                        className="h-6 bg-muted-foreground"
                      />

                      <CardDescription>
                        <PreviousBtn
                          className="text-sm"
                          previousUrl="/admin/forms"
                        />
                      </CardDescription>
                    </>
                  )}
                </CardHeader>
                <CardContent className="flex flex-wrap items-center justify-start gap-4">
                  {cat.form.map((form) => (
                    <Card key={`form-${form.id}`} className="w-full max-w-80">
                      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0 w-full pb-0">
                        <Button variant={"link"} size={"link"} asChild>
                          <Link
                            prefetch={true}
                            href={`/admin/forms/${form.id}`}
                          >
                            <CardTitle className="flex items-center justify-center gap-1">
                              {form.title} <ChevronRight />
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
                                  href={`/admin/forms/${form.id}/actions/edit`}
                                >
                                  Modifier
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Link
                                  prefetch={true}
                                  href={`/admin/forms/${form.id}/actions/delete`}
                                >
                                  Supprimer
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="text-muted-foreground text-xs">
                        Question(s) lié(s): {form.question.length}
                      </CardFooter>
                    </Card>
                  ))}
                </CardContent>
                <CardFooter className="gap-4">
                  {Number(start) >= 0 ? (
                    <>
                      <Button variant={"secondary"} asChild>
                        <Link
                          prefetch={true}
                          href={`/admin/forms?category=${cat.title}&start=${
                            Number(start) - 5
                          }`}
                        >
                          Précédent
                        </Link>
                      </Button>
                      <Button variant={"secondary"} asChild>
                        <Link
                          prefetch={true}
                          href={`/admin/forms?category=${cat.title}&start=${
                            Number(start) + 5
                          }`}
                        >
                          Suivant
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <Button variant={"secondary"} asChild>
                      <Link
                        prefetch={true}
                        href={`/admin/forms?category=${cat.title}&start=0`}
                      >
                        <Ellipsis /> Voir tous les formulaires
                      </Link>
                    </Button>
                  )}
                </CardFooter>
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
