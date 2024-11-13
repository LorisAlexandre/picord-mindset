import { redirect } from "next/navigation";
import { logoutAction } from "@/app/(auth)/actions";
import { BASE_URL } from "@/lib/url";

export async function GET() {
  await logoutAction();

  return redirect(BASE_URL);
}
