"use client";

import { deleteFormAction } from "@/app/admin/categories/[category]/forms/actions";
import { Button, Input, Label } from "@/components/shadcn/ui";
import { SubmitBtn } from "@/components/submit-btn";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
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
export const FormDeleteAction = ({ id }: { id: string }) => {
  const params = useParams();
  const category = params.category;

  const [state, action] = useActionState(deleteFormAction, initialState);
  const submitRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="flex-1 max-w-xl h-full pt-4 flex flex-col gap-8">
      <Button variant={"ghost"} className="px-1 py-1 h-fit w-fit" asChild>
        <Link
          prefetch={true}
          href={`/admin/categories/${category}/forms/${id}`}
          className="flex gap-1"
        >
          <ArrowLeft />
          Retour
        </Link>
      </Button>

      <form
        action={async (formData) => {
          formData.set("id", id);
          formData.set("category", category as string);
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
