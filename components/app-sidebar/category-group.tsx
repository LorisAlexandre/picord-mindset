import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shadcn/ui";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

type ItemProps = {
  title: string;
  url: string;
  icon?: ReactNode;
};
const items: ItemProps[] = [
  {
    title: "sport",
    url: "/admin/sport",
  },
  {
    title: "mental",
    url: "/admin/mental",
  },
  {
    title: "nutrition",
    url: "/admin/nutrition",
  },
]; // fetch les category créer par admin

export const CategoryGroup = async () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Catégories</SidebarGroupLabel>
      <SidebarGroupAction title="Add Project">
        <Plus /> <span className="sr-only">Add Project</span>
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  {/* <item.icon /> */}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            // metre dropdown si je veux edit / delete
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
