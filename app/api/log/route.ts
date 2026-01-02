import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import logger from "@/lib/logger";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const userEmail = session?.user?.email || "Anonymous";
        
        const { action, details } = await req.json();

        logger.info(`Client Activity [${action}]: ${JSON.stringify(details)} | User: ${userEmail}`);
        
        return new NextResponse("OK", { status: 200 });
    } catch (error) {
        logger.error(`Error in logging API: ${error}`);
        return new NextResponse("Error", { status: 500 });
    }
}
