import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongoose";
import Entry from "@/models/Entry";

function dayKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function computeStreak(dates) {
  if (dates.length === 0) return 0;

  const daySet = new Set(dates.map(dayKey));
  const today = new Date();
  let cursor = new Date(today);
  let streak = 0;

  // If nothing logged today yet, streak counting still starts from
  // today; a gap today doesn't break yesterday's streak until the
  // day fully passes.
  if (!daySet.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (daySet.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const entries = await Entry.find(
    { userId: session.user.id },
    { entryDate: 1, mood: 1, content: 1 }
  ).lean();

  const totalEntries = entries.length;
  const totalWords = entries.reduce(
    (sum, e) => sum + (e.content?.trim().split(/\s+/).filter(Boolean).length || 0),
    0
  );

  const moodCounts = { great: 0, good: 0, okay: 0, low: 0, rough: 0 };
  for (const e of entries) {
    if (moodCounts[e.mood] !== undefined) moodCounts[e.mood] += 1;
  }

  const streak = computeStreak(entries.map((e) => e.entryDate));

  return NextResponse.json({
    totalEntries,
    totalWords,
    moodCounts,
    streak,
  });
}
