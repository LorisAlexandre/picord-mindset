import {
  Dialog,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shadcn/ui";
import { getCategories } from "@/lib/server/category";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

export const CategoryGroup = async () => {
  const categories = await getCategories();

  return (
    <SidebarGroupContent>
      <SidebarMenu>
        {categories.map((cat) => (
          <SidebarMenuItem key={cat.id}>
            <SidebarMenuButton asChild>
              <Link prefetch={true} href={`/admin/categories/${cat.title}`}>
                {/* <item.icon /> */}
                <span>{cat.title}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction>
                  <MoreHorizontal />
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                align="start"
                className="space-y-1"
              >
                <DropdownMenuItem>
                  <Link
                    prefetch={true}
                    href={`/admin/categories/${cat.title}/actions/edit`}
                  >
                    Modifier
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    prefetch={true}
                    href={`/admin/categories/${cat.title}/actions/delete`}
                  >
                    Supprimer
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  );
};
