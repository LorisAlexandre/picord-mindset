"use client";

import { deleteFormAction } from "@/app/admin/forms/actions";
import { Input, Label } from "@/components/shadcn/ui";
import { SubmitBtn } from "@/components/submit-btn";
import { cn } from "@/lib/utils";
import { useActionState, useRef, useState } from "react";
import { PreviousBtn } from "@/components/previous-btn";

const initialState: {
  fieldErrors?: {
    [key: string]: string[] | undefined;
  };
  message: string;
} = {
  message: "",
};
export const FormDeleteAction = ({ id }: { id: string }) => {
  const [state, action] = useActionState(deleteFormAction, initialState);
  const submitRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="flex-1 max-w-xl h-full pt-4 flex flex-col gap-8">
      <PreviousBtn previousUrl={`/admin/forms/${id}`} />

      <form
        action={async (formData) => {
          formData.set("id", id);
          await action(formData);
        }}
        className="flex flex-col gap-4 max-w-md"
      >
        <div className="flex flex-col gap-2">
          <div>
            <Label htmlFor="formId" className="font-semibold">
              Entre l'id du formulaire: "{id}" pour le supprimer
            </Label>
            <p className="text-sm text-muted-foreground">
              Cette action est irréversible. Cela supprimera de façon permanente
              la catégorie ainsi que le contenu et le suivi réalisés jusqu'à
              maintenant.
            </p>
          </div>
          <Input
            id="formId"
            name="formId"
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
                !!state.fieldErrors["formId"] &&
                "invalid:ring-1 invalid:ring-red-500"
            )}
            placeholder={id}
          />
          {!!state.fieldErrors && !!state.fieldErrors["formId"] && (
            <p className="text-sm text-red-500">
              * {state.fieldErrors["formId"]}
            </p>
          )}
        </div>

        <div>
          <SubmitBtn ref={submitRef} variant={"destructive"}>
            Supprimer le formulaire
          </SubmitBtn>
          {!!state.message && (
            <p className="text-sm text-red-500">* {state.message}</p>
          )}
        </div>
      </form>
    </div>
  );
};
