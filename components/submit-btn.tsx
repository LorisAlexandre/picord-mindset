"use client";

import { Button, ButtonProps } from "@/components/shadcn/ui";
import { Loader2 } from "lucide-react";
import { LegacyRef } from "react";
import { useFormStatus } from "react-dom";

interface Props extends ButtonProps {
  ref?: LegacyRef<HTMLButtonElement>;
}
export const SubmitBtn = (props: Props) => {
  const { pending } = useFormStatus();

  return (
    <Button {...props} disabled={pending} ref={props.ref}>
      {pending ? <Loader2 className="animate-spin" /> : props.children}
    </Button>
  );
};
