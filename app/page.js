import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) {
    redirect("/journal");
  }

  return (
    <main
      className="min-h-dvh flex flex-col items-center justify-center px-6"
      style={{
        paddingTop: "max(1.5rem, env(safe-area-inset-top))",
        paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="max-w-xl text-center space-y-6">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-brass">
          Vol. I — Private Edition
        </p>
        <h1 className="font-display text-5xl sm:text-6xl font-medium leading-[1.05]">
          Quiet Pages
        </h1>
        <p className="text-lg text-parchment-muted dark:text-ink-muted max-w-md mx-auto">
          A quiet, searchable place to keep what happened, how it felt, and what
          you noticed. Just for you.
        </p>
        <Link
          href="/signin"
          className="inline-flex items-center gap-2 bg-brass hover:bg-brass-light text-ink-bg font-body font-medium px-6 py-3 rounded-md shadow-soft transition-colors"
        >
          Begin writing
        </Link>
      </div>
    </main>
  );
}
