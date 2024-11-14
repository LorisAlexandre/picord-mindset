"use client";

import { deleteCategoryAction } from "@/app/admin/[category]/actions";
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
  const category = params.category;

  const [state, action] = useActionState(deleteCategoryAction, initialState);
  const submitRef = useRef<HTMLButtonElement | null>(null);

  return (
    <form
      action={async (formData) => {
        formData.set("id", id);
        await action(formData);
      }}
      className="flex flex-col gap-2"
    >
      <div>
        <Label htmlFor="title">
          Entre le titre de la catégorie: "{category}"
        </Label>
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
          <p className="text-sm text-red-500">* {state.fieldErrors["title"]}</p>
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
  );
};
