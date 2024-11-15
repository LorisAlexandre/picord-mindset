"use client";

import { createFormAction } from "@/app/admin/categories/[category]/forms/actions";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@/components/shadcn/ui";
import { SubmitBtn } from "@/components/submit-btn";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useActionState, useRef } from "react";

const initialState: {
  message: string;
  fieldErrors?: {
    [key: string]: string[] | undefined;
  };
} = {
  message: "",
};
export const FormCreateAction = () => {
  const [state, action] = useActionState(createFormAction, initialState);
  const submitBtnRef = useRef<HTMLButtonElement | null>(null);
  const params = useParams();
  const category = params.category;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Créer un nouveau formulaire</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </DialogDescription>
      </DialogHeader>
      <form
        action={async (formData) => {
          formData.set("category", category as string);
          await action(formData);
        }}
        className="flex flex-col gap-2"
      >
        <div>
          <Label htmlFor="title">Titre du formulaire</Label>
          <Input
            id="title"
            name="title"
            type="text"
            maxLength={64}
            onFocus={(e) => e.target.select()}
            onKeyDown={(e) => {
              if (e.code === "Enter") {
                e.preventDefault();
                submitBtnRef.current?.click();
              }
            }}
            className={cn(
              !!state.fieldErrors &&
                !!state.fieldErrors["title"] &&
                "invalid:ring-1 invalid:ring-red-500"
            )}
          />
          {!!state.fieldErrors && !!state.fieldErrors["title"] && (
            <p className="text-sm text-red-500">
              * {state.fieldErrors["title"]}
            </p>
          )}
        </div>

        <DialogFooter>
          <SubmitBtn ref={submitBtnRef}>Créer un nouveau formulaire</SubmitBtn>
        </DialogFooter>
        {!!state.message && (
          <p className="text-sm text-red-500">* {state.message}</p>
        )}
      </form>
    </DialogContent>
  );
};
