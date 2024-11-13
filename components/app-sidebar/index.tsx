import {
  Dialog,
  DialogTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
} from "@/components/shadcn/ui";
import { HTMLAttributes, Suspense } from "react";
import {
  CategoryGroupSkeleton,
  CategoryGroup,
  CategoryDialogAction,
} from "./category";
import { Plus } from "lucide-react";

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
              <CategoryDialogAction />
            </Dialog>
            <CategoryGroup />
          </SidebarGroup>
        </Suspense>
        {/* <SidebarSeparator /> */}
      </SidebarContent>
    </Sidebar>
  );
};
