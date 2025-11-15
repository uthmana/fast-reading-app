import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
export default withAuth(function middleware(req) {
    var _a;
    var role = (_a = req.nextauth.token) === null || _a === void 0 ? void 0 : _a.role;
    // Redirect to login if not authenticated
    if (!role) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    // Block admin routes for non-admins
    if (role !== "ADMIN" && req.nextUrl.pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
}, {
    callbacks: {
        authorized: function (_a) {
            var token = _a.token;
            return !!token;
        }, // only run if logged in
    },
});
export var config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|login|register).*)"],
    //matcher: ["/admin/:path*"],
};
