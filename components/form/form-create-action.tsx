"use client";

import { createFormAction } from "@/app/admin/forms/actions";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "@/components/shadcn/ui";
import { SubmitBtn } from "@/components/submit-btn";
import { cn } from "@/lib/utils";
import { Suspense, useActionState, useRef } from "react";
import { Category } from "@prisma/client";

const initialState: {
  message: string;
  fieldErrors?: {
    [key: string]: string[] | undefined;
  };
} = {
  message: "",
};
export const FormCreateAction = ({
  categories,
}: {
  categories: Category[];
}) => {
  const [state, action] = useActionState(createFormAction, initialState);
  const submitBtnRef = useRef<HTMLButtonElement | null>(null);

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
          await action(formData);
        }}
        className="flex flex-col gap-2"
      >
        <div>
          <Label htmlFor="category">Catégorie</Label>
          <Select name="category">
            <SelectTrigger
              className={cn(
                !!state.fieldErrors &&
                  !!state.fieldErrors["category"] &&
                  "invalid:ring-1 invalid:ring-red-500"
              )}
            >
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={`select-category-${cat.id}`} value={cat.title}>
                  {cat.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!!state.fieldErrors && !!state.fieldErrors["category"] && (
            <p className="text-sm text-red-500">
              * {state.fieldErrors["category"]}
            </p>
          )}
        </div>

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
