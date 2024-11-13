import { getCurrentSession } from "@/lib/server/session";
import { PasswordResetForm } from "../auth-form";

export default async function PasswordResetPage() {
  await getCurrentSession();

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div />
      <PasswordResetForm />
    </main>
  );
}
