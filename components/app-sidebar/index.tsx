import { Sidebar, SidebarContent } from "@/components/shadcn/ui";
import { HTMLAttributes, Suspense } from "react";
import { CategoryGroup } from "./category-group";
import { CategoryGroupSkeleton } from "./category-group-skeleton";

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
          <CategoryGroup />
        </Suspense>
        {/* <SidebarSeparator /> */}
      </SidebarContent>
    </Sidebar>
  );
};
