import { SelectContent, SelectItem } from "@/components/shadcn/ui";
import { getCategories } from "@/lib/server/category";
import { MouseEvent } from "react";

export const CategorySelectContent = async ({}: {}) => {
  const categories = await getCategories();

  const handleChangeCategory = async () => {};

  return (
    <SelectContent>
      {categories.map((cat) => (
        <SelectItem key={cat.id} value={cat.id} onChange={handleChangeCategory}>
          {cat.title}
        </SelectItem>
      ))}
    </SelectContent>
  );
};
