import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/actions/session";
import { cookies } from "next/headers";

const protectedRoutes = ["/admin", "/user"];
const publicRoutes = ["/api/login", "/api/signup", "/"];

export default async function middleware(req: NextRequest) {
  console.log("Middleware runnig");
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/api/login", req.nextUrl));
  }

  if (
    isPublicRoute &&
    session?.userId &&
    session?.role === "admin" &&
    !req.nextUrl.pathname.startsWith("/admin")
  ) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  if (
    isPublicRoute &&
    session?.userId &&
    session?.role === "user" &&
    !req.nextUrl.pathname.startsWith("/user")
  ) {
    return NextResponse.redirect(new URL("/user", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
