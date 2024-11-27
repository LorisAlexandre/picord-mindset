import { SelectContent, SelectItem, Skeleton } from "@/components/shadcn/ui";

export const CategorySelectContentSkeleton = () => {
  return (
    <SelectContent>
      {Array.from({ length: 3 }).map((_, i) => (
        <SelectItem key={i} value={i.toString()}>
          <Skeleton />
        </SelectItem>
      ))}
    </SelectContent>
  );
};
