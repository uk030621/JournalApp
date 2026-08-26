import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongoose";
import Entry from "@/models/Entry";

// GET /api/entries?q=search&tag=work&mood=good
export async function GET(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const tag = searchParams.get("tag")?.trim();
  const mood = searchParams.get("mood")?.trim();

  const filter = { userId: session.user.id };
  if (tag) filter.tags = tag;
  if (mood) filter.mood = mood;
  if (q) filter.$text = { $search: q };

  const projection = q ? { score: { $meta: "textScore" } } : {};
  const sort = q ? { score: { $meta: "textScore" } } : { pinned: -1, entryDate: -1 };

  const entries = await Entry.find(filter, projection).sort(sort).lean();

  return NextResponse.json({ entries });
}

// POST /api/entries  { title, content, mood, tags, entryDate }
export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, content, mood, tags, entryDate } = body;

  if (!content?.trim()) {
    return NextResponse.json(
      { error: "Content is required" },
      { status: 400 }
    );
  }

  await dbConnect();

  const entry = await Entry.create({
    userId: session.user.id,
    title: title?.trim() || "Untitled entry",
    content,
    mood: mood || "okay",
    tags: Array.isArray(tags)
      ? tags.map((t) => t.trim().toLowerCase()).filter(Boolean)
      : [],
    entryDate: entryDate ? new Date(entryDate) : new Date(),
  });

  return NextResponse.json({ entry }, { status: 201 });
}
