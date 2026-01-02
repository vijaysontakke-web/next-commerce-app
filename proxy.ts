import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import logger from "@/lib/logger";

const middleware = withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAdmin = token?.role === "admin";
        const isOnAdmin = req.nextUrl.pathname.startsWith("/admin");

        logger.info(`User ${token?.email || 'Anonymous'} accessing ${req.nextUrl.pathname}`);

        if (isOnAdmin && !isAdmin) {
            logger.error(`Unauthorized access attempt to ${req.nextUrl.pathname} by ${token?.email}`);
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
