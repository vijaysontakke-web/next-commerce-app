import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const middleware = withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAdmin = token?.role === "admin";
        const isOnAdmin = req.nextUrl.pathname.startsWith("/admin");

        if (isOnAdmin && !isAdmin) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export default middleware;
export { middleware as proxy };

export const config = {
    matcher: ["/admin/:path*", "/orders/:path*"],
};
