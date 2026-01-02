import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";
import logger from "@/lib/logger";

export async function GET(req: Request) {
    try {
        const categories = await db.category.findMany();
        return NextResponse.json(categories);
    } catch (error) {
        logger.error(`[CATEGORIES_GET] Error: ${error}`);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        // Check if admin
        if (!session || (session.user as any)?.role !== "admin") {
            logger.warn(`[CATEGORIES_POST] Unauthorized access attempt by ${session?.user?.email || 'Anonymous'}`);
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const body = await req.json();
        const { name, description, slug } = body;

        if (!name || !slug) {
            logger.warn(`[CATEGORIES_POST] Missing required fields for category: ${name}`);
            return new NextResponse("Name and slug are required", { status: 400 });
        }

        const category = await db.category.create({
            data: { name, description, slug }
        });

        logger.info(`[CATEGORIES_POST] Category created: ${name} by ${session.user?.email || 'Unknown'}`);
        return NextResponse.json(category);
    } catch (error) {
        logger.error(`[CATEGORIES_POST] Error: ${error}`);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== "admin") {
            logger.warn(`[CATEGORIES_PUT] Unauthorized access attempt by ${session?.user?.email || 'Anonymous'}`);
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const body = await req.json();
        const { id, name, description, slug } = body;

        if (!id) {
            return new NextResponse("Category ID required", { status: 400 });
        }

        const updatedCategory = await db.category.update({
            where: { id },
            data: { name, description, slug }
        });

        logger.info(`[CATEGORIES_PUT] Category updated: ${id} by ${session.user?.email || 'Unknown'}`);
        return NextResponse.json(updatedCategory);
    } catch (error) {
        logger.error(`[CATEGORIES_PUT] Error: ${error}`);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== "admin") {
            logger.warn(`[CATEGORIES_DELETE] Unauthorized access attempt by ${session?.user?.email || 'Anonymous'}`);
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return new NextResponse("Category ID required", { status: 400 });
        }

        await db.category.delete({
            where: { id }
        });

        logger.info(`[CATEGORIES_DELETE] Category deleted: ${id} by ${session.user?.email || 'Unknown'}`);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        logger.error(`[CATEGORIES_DELETE] Error: ${error}`);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

