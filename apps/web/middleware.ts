import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // const sessionCookie = getSessionCookie(request);
  // const sessionCookie = request.cookies.get("better-auth.session_token");
  const sessionCookie = await getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/upload"], // Specify the routes the middleware applies to
};

// Stole this from a discord
export async function getSessionCookie(
  request: NextRequest,
  config?: { cookieName: string; cookiePrefix: string; path: string }
) {
  // const cookieStore = await import("next/headers").then(mod => mod.cookies());
  const cookieStore = await cookies();
  return cookieStore.get(
    `${config?.cookiePrefix || "better-auth"}.${config?.cookieName || "session_token"}`
  );
}
