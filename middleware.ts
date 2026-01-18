import { NextResponse } from "next/server";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const role = req.nextauth.token?.role as string | undefined;

    if (req.nextUrl.pathname === "/") {
      return NextResponse.next();
    }

    // Redirect to login if not authenticated
    if (!role) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Block admin routes for non-admins
    if (role === "STUDENT" && req.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/ogrenci", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.[^/]+$|login|register|bayilik|blog|kurumsal|basvur).*)",
  ],
};
