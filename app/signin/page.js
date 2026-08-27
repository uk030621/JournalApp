import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignInButton from "../components/SignInButton";

export default async function SignInPage({ searchParams }) {
  // searchParams is also async in Next.js 15 and must be awaited.
  const params = await searchParams;
  const callbackUrl = params?.callbackUrl || "/journal";

  const session = await auth();
  if (session?.user) {
    redirect(callbackUrl);
  }

  return (
    <main
      className="min-h-dvh flex items-center justify-center px-6"
      style={{
        paddingTop: "max(1.5rem, env(safe-area-inset-top))",
        paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-brass">
            Quiet Pages
          </p>
          <h1 className="font-display text-3xl">Welcome back</h1>
          <p className="text-sm text-parchment-muted dark:text-ink-muted">
            Sign in to open your journal.
          </p>
        </div>
        <SignInButton callbackUrl={callbackUrl} />
      </div>
    </main>
  );
}
