"use client";

import { Button, ButtonProps } from "@/components/shadcn/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props extends ButtonProps {
  previousUrl?: string;
}
export const PreviousBtn = ({ previousUrl, ...props }: Props) => {
  const router = useRouter();

  return (
    <Button
      {...props}
      onClick={(e) => {
        if (!previousUrl) {
          e.preventDefault();
          router.back();
        }
      }}
      variant={"link"}
      size={"link"}
      asChild
    >
      {props.children ? (
        props.children
      ) : (
        <Link href={previousUrl ?? ""}>
          <ArrowLeft /> Retour
        </Link>
      )}
    </Button>
  );
};
