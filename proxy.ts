import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // 🔐 Protect /notes (any authenticated user)
  if (pathname.startsWith("/semester")) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  

  // 🛠 Protect /admin (admin + superadmin)
  if (pathname.startsWith("/admin")) {
    if (!token || !["admin", "superadmin"].includes(token.role as string)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 👑 Protect /superadmin (superadmin only)
  if (pathname.startsWith("/superadmin")) {
    if (!token || token.role !== "superadmin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  
const isSemesterRoute = /^\/\d+$/.test(pathname);

  if (isSemesterRoute) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}
