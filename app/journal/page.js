import { auth } from "@/auth";
import { redirect } from "next/navigation";
import JournalClient from "./JournalClient";

export default async function JournalPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin");
  }

  return <JournalClient user={session.user} />;
}
