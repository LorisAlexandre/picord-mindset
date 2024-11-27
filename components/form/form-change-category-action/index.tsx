"use client";

import { Select, SelectTrigger, SelectValue } from "@/components/shadcn/ui/";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { CategorySelectContent } from "./category-select-content";
import { CategorySelectContentSkeleton } from "./category-select-content-skeleton";

export const FormChangeCategoryAction = () => {
  const params = useParams();
  const formId = params.form;

  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Catégorie" />
      </SelectTrigger>
      <Suspense fallback={<CategorySelectContentSkeleton />}>
        <CategorySelectContent />
      </Suspense>
    </Select>
  );
};
