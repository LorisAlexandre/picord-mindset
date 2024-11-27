import { NextResponse } from "next/server";
import { searchContent } from "@/lib/server/content";
import { getCurrentSession } from "@/lib/server/session";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  const { user } = await getCurrentSession();

  if (user.role !== "ADMIN") {
    return NextResponse.redirect("/not-authorized");
  }

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchContent(query);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "An error occurred while searching" },
      { status: 500 }
    );
  }
}
