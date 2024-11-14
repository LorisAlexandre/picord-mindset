"use client";

import { createCategoryAction } from "@/app/admin/[category]/actions";
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
import { useActionState, useRef } from "react";

const initialState: {
  message: string;
  fieldErrors?: {
    [key: string]: string[] | undefined;
  };
} = {
  message: "",
};
export const CategoryCreateAction = () => {
  const [state, action] = useActionState(createCategoryAction, initialState);
  const submitBtnRef = useRef<HTMLButtonElement | null>(null);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Créer une nouvelle catégorie</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </DialogDescription>
      </DialogHeader>
      <form action={action} className="flex flex-col gap-2">
        <div>
          <Label htmlFor="title">Titre de la catégorie</Label>
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
          <SubmitBtn ref={submitBtnRef}>Créer une nouvelle catégorie</SubmitBtn>
        </DialogFooter>
        {!!state.message && (
          <p className="text-sm text-red-500">* {state.message}</p>
        )}
      </form>
    </DialogContent>
  );
};
