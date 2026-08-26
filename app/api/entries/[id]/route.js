import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongoose";
import Entry from "@/models/Entry";

// In Next.js 15, dynamic route params are async and must be awaited
// before destructuring.

export async function GET(request, { params }) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const entry = await Entry.findOne({ _id: id, userId: session.user.id }).lean();

  if (!entry) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  return NextResponse.json({ entry });
}

export async function PUT(request, { params }) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, content, mood, tags, entryDate, pinned } = body;

  await dbConnect();

  const update = {};
  if (title !== undefined) update.title = title.trim();
  if (content !== undefined) update.content = content;
  if (mood !== undefined) update.mood = mood;
  if (tags !== undefined) {
    update.tags = Array.isArray(tags)
      ? tags.map((t) => t.trim().toLowerCase()).filter(Boolean)
      : [];
  }
  if (entryDate !== undefined) update.entryDate = new Date(entryDate);
  if (pinned !== undefined) update.pinned = !!pinned;

  const entry = await Entry.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    { $set: update },
    { new: true }
  ).lean();

  if (!entry) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  return NextResponse.json({ entry });
}

export async function DELETE(request, { params }) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const result = await Entry.findOneAndDelete({
    _id: id,
    userId: session.user.id,
  });

  if (!result) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
