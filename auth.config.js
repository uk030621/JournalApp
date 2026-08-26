// Edge-safe subset of the auth config. This file must NOT import the
// MongoDB adapter or the `mongodb`/`mongoose` drivers — those need
// Node's `crypto` module, which isn't available in the Edge runtime
// that middleware runs on. Keep this file lean; the full config with
// the adapter lives in auth.js and is only used by route handlers
// and server components (Node runtime).
export const authConfig = {
  pages: {
    signIn: "/signin",
  },
  providers: [], // real providers are added in auth.js
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnJournal = request.nextUrl.pathname.startsWith("/journal");
      if (isOnJournal) return isLoggedIn;
      return true;
    },
  },
};
