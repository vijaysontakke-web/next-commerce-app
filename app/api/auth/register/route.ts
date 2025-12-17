import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, name } = body;

        if (!email || !password || !name) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
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

        return NextResponse.json(user);
    } catch (error) {
        console.error("[REGISTER_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
