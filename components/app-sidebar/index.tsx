import {
  Button,
  Dialog,
  DialogTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/shadcn/ui";
import { HTMLAttributes, Suspense } from "react";
import {
  CategoryGroupSkeleton,
  CategoryGroup,
  CategoryCreateAction,
} from "./category";
import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";

interface Props extends HTMLAttributes<HTMLDivElement> {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}
export const AppSidebar = ({ ...props }: Props) => {
  return (
    <Sidebar {...props}>
      <SidebarContent>
        <Suspense fallback={<CategoryGroupSkeleton />}>
          <SidebarGroup>
            <SidebarGroupLabel>
              <Button
                className="text-xs font-medium text-sidebar-foreground/70"
                variant={"link"}
                size={"link"}
                asChild
              >
                <Link href={"/admin/categories"}>Catégories</Link>
              </Button>
            </SidebarGroupLabel>
            <Dialog>
              <DialogTrigger asChild>
                <SidebarGroupAction title="Add Project">
                  <Plus /> <span className="sr-only">Add Project</span>
                </SidebarGroupAction>
              </DialogTrigger>
              <CategoryCreateAction />
            </Dialog>
            <CategoryGroup />
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>
              <Button
                className="text-xs font-medium text-sidebar-foreground/70"
                variant={"link"}
                size={"link"}
                asChild
              >
                <Link href={"/admin/forms"}>Formulaires</Link>
              </Button>
            </SidebarGroupLabel>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>
              <Button
                className="text-xs font-medium text-sidebar-foreground/70"
                variant={"link"}
                size={"link"}
                asChild
              >
                <Link href={"/admin/content"}>Contenu</Link>
              </Button>
            </SidebarGroupLabel>
          </SidebarGroup>
        </Suspense>
        {/* <SidebarSeparator /> */}
      </SidebarContent>
    </Sidebar>
  );
};
