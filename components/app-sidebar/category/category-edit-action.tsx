"use client";

import { editCategoryAction } from "@/app/admin/categories/actions";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Switch,
} from "@/components/shadcn/ui";
import { SubmitBtn } from "@/components/submit-btn";
import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useActionState, useRef, useState } from "react";

const initialState: {
  fieldErrors?: {
    [key: string]: string[] | undefined;
  };
  message: string;
} = {
  message: "",
};
export const CategoryEditAction = ({ category }: { category: Category }) => {
  const [state, action] = useActionState(editCategoryAction, initialState);
  const submitRef = useRef<HTMLButtonElement | null>(null);
  const [isPublic, setIsPublic] = useState<boolean>(!!category.isPublic);

  return (
    <div className="flex-1 h-full pt-4 flex flex-col gap-8">
      <Button variant={"ghost"} className="px-1 py-1 h-fit w-fit" asChild>
        <Link
          prefetch={true}
          href={`/admin/categories/${category.title}`}
          className="flex gap-1"
        >
          <ArrowLeft />
          Retour
        </Link>
      </Button>

      <form
        action={async (formData) => {
          formData.set("id", category.id);
          formData.set("isPublic", String(isPublic));
          await action(formData);
        }}
        className="flex flex-col gap-4 max-w-md"
      >
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="title"
            className="font-semibold leading-none tracking-tight"
          >
            Titre de la catégorie
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
            defaultValue={category.title}
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

        <div>
          <Card className="flex items-center justify-center">
            <CardHeader>
              <CardTitle>Visibilité</CardTitle>
              <CardDescription>
                <p>
                  Permet de rendre la catégorie accessible aux utilisateurs.
                </p>
                <span className="text-xs">
                  (Tu peux créer une catégorie est la rendre inacessible tant
                  qu'elle n'est pas aboutie)
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-1 items-center justify-start py-0">
              <Switch
                name="isPublic"
                id="isPublic"
                onCheckedChange={() => setIsPublic(!isPublic)}
                defaultChecked={!!category.isPublic}
              />
              <span className="font-semibold">Visible</span>
            </CardContent>
          </Card>
          {!!state.fieldErrors && !!state.fieldErrors["isPublic"] && (
            <p className="text-sm text-red-500">
              * {state.fieldErrors["isPublic"]}
            </p>
          )}
        </div>

        <div>
          <SubmitBtn ref={submitRef}>Appliquer les changements</SubmitBtn>
          {!!state.message && (
            <p className="text-sm text-red-500">* {state.message}</p>
          )}
        </div>
      </form>
    </div>
  );
};
