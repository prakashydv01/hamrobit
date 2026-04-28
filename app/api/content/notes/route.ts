import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { contentfulClient } from "@/lib/contentful";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const entries = await contentfulClient.getEntries({
    content_type: "notes",
    order: ["-sys.createdAt"],
  });

  return NextResponse.json(entries.items);
}
