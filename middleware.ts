import { clerkMiddleware } from "@clerk/nextjs/server";
export default clerkMiddleware({
  // authorizedParties: ['/', '/api/clerk'],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};