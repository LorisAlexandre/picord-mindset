import {
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shadcn/ui";
import { getCategories } from "@/lib/server/category";
import Link from "next/link";

export const CategoryGroup = async () => {
  const categories = await getCategories();

  return (
    <SidebarGroupContent>
      <SidebarMenu>
        {categories.map((cat) => (
          <SidebarMenuItem key={cat.title}>
            <SidebarMenuButton asChild>
              <Link href={`/admin/${cat.title}`}>
                {/* <item.icon /> */}
                <span>{cat.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          // metre dropdown si je veux edit / delete
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  );
};
