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
              <Link href={`/admin/${cat.title}`}>
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
                  <Link href={`/admin/${cat.title}/edit`}>Modifier</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={`/admin/${cat.title}/delete`}>Supprimer</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  );
};
