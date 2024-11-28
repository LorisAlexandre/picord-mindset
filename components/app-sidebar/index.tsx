import {
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
import { Plus } from "lucide-react";
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
            <SidebarGroupLabel>Catégories</SidebarGroupLabel>
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
            <SidebarGroupLabel>Formulaires</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuButton asChild>
                  <Link prefetch={true} href={`/admin/forms`}>
                    {/* <item.icon /> */}
                    <span>Formulaires</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Contenu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuButton asChild>
                  <Link prefetch={true} href={`/admin/content`}>
                    {/* <item.icon /> */}
                    <span>Contenu</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </Suspense>
        {/* <SidebarSeparator /> */}
      </SidebarContent>
    </Sidebar>
  );
};
