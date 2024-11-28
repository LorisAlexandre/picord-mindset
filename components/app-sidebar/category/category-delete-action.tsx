"use client";

import { deleteCategoryAction } from "@/app/admin/categories/actions";
import { PreviousBtn } from "@/components/previous-btn";
import { Input, Label } from "@/components/shadcn/ui";
import { SubmitBtn } from "@/components/submit-btn";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useActionState, useRef } from "react";

const initialState: {
  fieldErrors?: {
    [key: string]: string[] | undefined;
  };
  message: string;
} = {
  message: "",
};
export const CategoryDeleteAction = ({ id }: { id: string }) => {
  const params = useParams();
  const category = decodeURIComponent(params.category as string).replaceAll(
    "Ã©",
    "é"
  );

  const [state, action] = useActionState(deleteCategoryAction, initialState);
  const submitRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="flex-1 h-full pt-4 flex flex-col gap-8">
      <PreviousBtn previousUrl={`/admin/categories/${category}`} />

      <form
        action={async (formData) => {
          formData.set("id", id);
          await action(formData);
        }}
        className="flex flex-col gap-4 max-w-md"
      >
        <div className="flex flex-col gap-2">
          <div>
            <Label htmlFor="title" className="font-semibold">
              Entre le titre de la catégorie: "{category}" pour la supprimer
            </Label>
            <p className="text-sm text-muted-foreground">
              Cette action est irréversible. Cela supprimera de façon permanente
              la catégorie ainsi que le contenu et le suivi réalisés jusqu'à
              maintenant.
            </p>
          </div>
          <Input
            id="title"
            name="title"
            type="text"
            onFocus={(e) => e.target.select()}
            onKeyDown={(e) => {
              if (e.code === "Enter") {
                e.preventDefault();
                submitRef.current?.click();
              }
            }}
            className={cn(
              !!state.fieldErrors &&
                !!state.fieldErrors["title"] &&
                "invalid:ring-1 invalid:ring-red-500"
            )}
            placeholder={(category as string) ?? ""}
          />
          {!!state.fieldErrors && !!state.fieldErrors["title"] && (
            <p className="text-sm text-red-500">
              * {state.fieldErrors["title"]}
            </p>
          )}
        </div>

        <div>
          <SubmitBtn ref={submitRef} variant={"destructive"}>
            Supprimer {category}
          </SubmitBtn>
          {!!state.message && (
            <p className="text-sm text-red-500">* {state.message}</p>
          )}
        </div>
      </form>
    </div>
  );
};
