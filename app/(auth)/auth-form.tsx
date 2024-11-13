"use client";

import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/shadcn/ui";
import { SubmitBtn } from "@/components/submit-btn";
import { Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useActionState, useRef, useState } from "react";
import { loginAction, passwordResetAction, signupAction } from "./actions";
import { cn } from "@/lib/utils";

const initialState: {
  message: string;
  fieldErrors?: { [key: string]: string[] | undefined };
} = {
  message: "",
  fieldErrors: undefined,
};

export const LoginForm = () => {
  const [state, action] = useActionState(loginAction, initialState);
  const [seePass, setSeePass] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const submitRef = useRef<HTMLButtonElement | null>(null);
  const passInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Card className="rounded-none flex flex-col items-center justify-center">
      <CardHeader className="flex flex-col items-center">
        <CardTitle>Connectes-toi</CardTitle>
        <CardDescription>
          Petite description qui te motive à te connecter
        </CardDescription>
      </CardHeader>
      <form
        className="max-w-md w-full"
        action={async (formData) => {
          formData.set("callbackUrl", callbackUrl ?? "");
          await action(formData);
        }}
      >
        <CardContent className="flex flex-col gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              className={cn(
                !!state.fieldErrors &&
                  !!state.fieldErrors["email"] &&
                  "invalid:ring-1 invalid:ring-red-500"
              )}
              id="email"
              name="email"
              type="email"
              maxLength={256}
              onFocus={(e) => e.target.select()}
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  e.preventDefault();
                  passInputRef.current?.focus();
                }
              }}
              placeholder="utilisateur@exemple.com"
              required
            />
            {!!state.fieldErrors && !!state.fieldErrors["email"] && (
              <p className="text-sm text-red-500">
                * {state.fieldErrors["email"]}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <div className="flex gap-1">
              <Input
                ref={passInputRef}
                className={cn(
                  !!state.fieldErrors &&
                    !!state.fieldErrors["password"] &&
                    "invalid:ring-1 invalid:ring-red-500"
                )}
                id="password"
                name="password"
                type={seePass ? "text" : "password"}
                maxLength={256}
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => {
                  if (e.code === "Enter") {
                    e.preventDefault();
                    submitRef.current?.click();
                  }
                }}
                placeholder="mot de passe"
                required
              />

              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setSeePass(!seePass);
                }}
                variant={"outline"}
                size={"icon"}
              >
                {seePass ? <Eye /> : <EyeOff />}
              </Button>
            </div>
            {!!state.fieldErrors && !!state.fieldErrors["password"] && (
              <p className="text-sm text-red-500">
                * {state.fieldErrors["password"]}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start justify-start gap-2">
          <SubmitBtn ref={submitRef} className="w-full">
            Se connecter
          </SubmitBtn>
          {!!state.message && (
            <p className="text-sm text-red-500">* {state.message}</p>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export const SignupForm = () => {
  const [state, action] = useActionState(signupAction, initialState);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const submitRef = useRef<HTMLButtonElement | null>(null);

  return (
    <Card className="rounded-none flex flex-col items-center justify-center">
      <CardHeader className="flex flex-col items-center">
        <CardTitle>Inscris-toi</CardTitle>
        <CardDescription>
          Petite description qui te motive à t'inscrire
        </CardDescription>
      </CardHeader>
      <form
        className="max-w-md w-full"
        action={async (formData) => {
          formData.set("callbackUrl", callbackUrl ?? "");
          await action(formData);
        }}
      >
        <CardContent className="flex flex-col gap-4 pb-2">
          <div>
            <Label htmlFor="name">Nom</Label>
            <Input
              className={cn(
                !!state.fieldErrors &&
                  !!state.fieldErrors["name"] &&
                  "invalid:ring-1 invalid:ring-red-500"
              )}
              id="name"
              name="name"
              type="text"
              maxLength={32}
              onFocus={(e) => e.target.select()}
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  e.preventDefault();
                  submitRef.current?.click();
                }
              }}
              placeholder="John Doe"
              required
            />
            {!!state.fieldErrors && !!state.fieldErrors["name"] && (
              <p className="text-sm text-red-500">
                * {state.fieldErrors["name"]}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              className={cn(
                !!state.fieldErrors &&
                  !!state.fieldErrors["email"] &&
                  "invalid:ring-1 invalid:ring-red-500"
              )}
              id="email"
              name="email"
              type="email"
              maxLength={256}
              onFocus={(e) => e.target.select()}
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  e.preventDefault();
                  submitRef.current?.click();
                }
              }}
              placeholder="utilisateur@exemple.com"
              required
            />
            {!!state.fieldErrors && !!state.fieldErrors["email"] && (
              <p className="text-sm text-red-500">
                * {state.fieldErrors["email"]}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start justify-start gap-2">
          <SubmitBtn ref={submitRef} className="w-full">
            S'inscrire par email
          </SubmitBtn>
          {!!state.message && (
            <p className="text-sm text-red-500">* {state.message}</p>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export const PasswordResetForm = () => {
  const [state, action] = useActionState(passwordResetAction, initialState);
  const [seePass, setSeePass] = useState(false);
  const [seeConfirmPass, setSeeConfirmPass] = useState(false);

  const confirmPassInputRef = useRef<HTMLInputElement | null>(null);
  const submitRef = useRef<HTMLButtonElement | null>(null);

  return (
    <Card className="rounded-none flex flex-col items-center justify-center">
      <CardHeader className="flex flex-col items-center">
        <CardTitle>Change ton mot de passe</CardTitle>
        <CardDescription>
          Petite description pour changer ton mot de passe
        </CardDescription>
      </CardHeader>
      <form className="max-w-md w-full" action={action}>
        <CardContent className="flex flex-col gap-4">
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <div className="flex gap-1">
              <Input
                className={cn(
                  !!state.fieldErrors &&
                    !!state.fieldErrors["password"] &&
                    "invalid:ring-1 invalid:ring-red-500"
                )}
                id="password"
                name="password"
                type={seePass ? "text" : "password"}
                maxLength={256}
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => {
                  if (e.code === "Enter") {
                    e.preventDefault();
                    confirmPassInputRef.current?.focus();
                  }
                }}
                required
              />
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setSeePass(!seePass);
                }}
                variant={"outline"}
                size={"icon"}
              >
                {seePass ? <Eye /> : <EyeOff />}
              </Button>
            </div>
            {!!state.fieldErrors && !!state.fieldErrors["password"] && (
              <p className="text-sm text-red-500">
                * {state.fieldErrors["password"]}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">
              Confirmation du mot de passe
            </Label>
            <div className="flex gap-1">
              <Input
                ref={confirmPassInputRef}
                className={cn(
                  !!state.fieldErrors &&
                    !!state.fieldErrors["confirmPassword"] &&
                    "invalid:ring-1 invalid:ring-red-500"
                )}
                id="confirmPassword"
                name="confirmPassword"
                type={seePass ? "text" : "password"}
                maxLength={256}
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => {
                  if (e.code === "Enter") {
                    e.preventDefault();
                    submitRef.current?.click();
                  }
                }}
                required
              />

              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setSeeConfirmPass(!seeConfirmPass);
                }}
                variant={"outline"}
                size={"icon"}
              >
                {seeConfirmPass ? <Eye /> : <EyeOff />}
              </Button>
            </div>
            {!!state.fieldErrors && !!state.fieldErrors["confirmPassword"] && (
              <p className="text-sm text-red-500">
                * {state.fieldErrors["confirmPassword"]}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start justify-start gap-2">
          <SubmitBtn ref={submitRef} className="w-full">
            Se connecter
          </SubmitBtn>
          {!!state.message && (
            <p className="text-sm text-red-500">* {state.message}</p>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};
