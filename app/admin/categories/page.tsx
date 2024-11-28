import { CategoryCreateAction } from "@/components/app-sidebar/category";
import { PreviousBtn } from "@/components/previous-btn";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Separator,
} from "@/components/shadcn/ui";
import { getCategories } from "@/lib/server/category";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="flex-1 flex pt-4 px-2 max-h-screen">
      <Card className="flex-1 flex flex-col max-h-[85vh]" variant={"ghost"}>
        <div className="flex items-center justify-between px-6 pb-2">
          <CardHeader className="p-0">
            <CardTitle>Catégories</CardTitle>
          </CardHeader>
          <CardFooter className="p-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Créer une catégorie</Button>
              </DialogTrigger>
              <CategoryCreateAction />
            </Dialog>
          </CardFooter>
        </div>
        <Separator />
        <CardContent className="flex-1 pt-4 flex flex-wrap gap-4 bg-muted/20 max-h-full overflow-y-auto">
          {categories.map((category) => (
            <Card
              variant={"ghost"}
              key={category.id}
              className="w-full bg-card shadow-sm max-w-64 h-fit"
            >
              <CardHeader className="flex-row items-center justify-between gap-4 w-full">
                <CardTitle>
                  <Button variant={"link"} size={"link"} asChild>
                    <Link
                      prefetch={true}
                      href={`/admin/categories/${category.title}`}
                    >
                      {category.title} <ChevronRight />
                    </Link>
                  </Button>
                </CardTitle>
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
                          href={`/admin/categories/${category.title}/actions/edit`}
                        >
                          Modifier
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link
                          prefetch={true}
                          href={`/admin/categories/${category.title}/actions/delete`}
                        >
                          Supprimer
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
