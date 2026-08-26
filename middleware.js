import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Uses only the edge-safe config (no MongoDB adapter/driver), so
// this can run on the Edge runtime without pulling in Node's
// `crypto` module. The `authorized` callback in auth.config.js
// decides which routes require a session.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/journal/:path*"],
};
