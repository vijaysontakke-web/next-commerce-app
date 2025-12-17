import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const categories = await db.category.findMany();
        return NextResponse.json(categories);
    } catch (error) {
        console.error("[CATEGORIES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        // Check if admin
        if (!session || (session.user as any)?.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const body = await req.json();
        const { name, description, slug } = body;

        if (!name || !slug) {
            return new NextResponse("Name and slug are required", { status: 400 });
        }

        const category = await db.category.create({
            data: { name, description, slug }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error("[CATEGORIES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session || (session.user as any)?.role !== "admin") {
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

        return NextResponse.json(updatedCategory);
    } catch (error) {
        console.error("[CATEGORIES_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (!session || (session.user as any)?.role !== "admin") {
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

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[CATEGORIES_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
