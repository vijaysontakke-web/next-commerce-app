import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import logger from "@/lib/logger";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, name } = body;

        logger.info(`Registration attempt for email: ${email}`);

        if (!email || !password || !name) {
            logger.warn(`Registration failed: Missing fields for email: ${email}`);
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            logger.warn(`Registration failed: User already exists: ${email}`);
            return new NextResponse("User already exists", { status: 409 });
        }

        const user = await db.user.create({
            data: {
                name,
                email,
                password, // In production, hash this!
                role: "user",
            },
        });

        logger.info(`User registered successfully: ${email}`);
        return NextResponse.json(user);
    } catch (error) {
        logger.error(`[REGISTER_POST] Internal Error: ${error}`);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
