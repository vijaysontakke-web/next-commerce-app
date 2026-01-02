import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";
import logger from "@/lib/logger";

export async function GET(req: Request) {
    try {
        const products = await db.product.findMany();
        return NextResponse.json(products);
    } catch (error) {
        logger.error(`[PRODUCTS_GET] Error: ${error}`);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== "admin") {
            logger.warn(`[PRODUCTS_POST] Unauthorized access attempt by ${session?.user?.email || 'Anonymous'}`);
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const body = await req.json();
        const { name, slug, description, price, categoryId, inventory, images, features } = body;

        if (!name || !slug || !price) {
            logger.warn(`[PRODUCTS_POST] Missing required fields for product: ${name}`);
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const product = await db.product.create({
            data: {
                name,
                slug,
                description: description || "",
                price: parseFloat(price),
                currency: "INR",
                categoryId: categoryId || "",
                inventory: parseInt(inventory) || 0,
                images: images || [],
                features: features || [],
                rating: 0,
                reviewCount: 0
            }
        });

        logger.info(`[PRODUCTS_POST] Product created: ${name} by ${session.user?.email || 'Unknown'}`);
        return NextResponse.json(product);
    } catch (error) {
        logger.error(`[PRODUCTS_POST] Error: ${error}`);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== "admin") {
            logger.warn(`[PRODUCTS_PUT] Unauthorized access attempt by ${session?.user?.email || 'Anonymous'}`);
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const body = await req.json();
        const { id, name, slug, description, price, categoryId, inventory, images, features } = body;

        if (!id) {
            return new NextResponse("Product ID required", { status: 400 });
        }

        const updatedProduct = await db.product.update({
            where: { id },
            data: {
                name,
                slug,
                description,
                price: parseFloat(price),
                categoryId,
                inventory: parseInt(inventory),
                images,
                features
            }
        });

        logger.info(`[PRODUCTS_PUT] Product updated: ${id} by ${session.user?.email || 'Unknown'}`);
        return NextResponse.json(updatedProduct);
    } catch (error) {
        logger.error(`[PRODUCTS_PUT] Error: ${error}`);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== "admin") {
            logger.warn(`[PRODUCTS_DELETE] Unauthorized access attempt by ${session?.user?.email || 'Anonymous'}`);
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return new NextResponse("Product ID required", { status: 400 });
        }

        await db.product.delete({
            where: { id }
        });

        logger.info(`[PRODUCTS_DELETE] Product deleted: ${id} by ${session.user?.email || 'Unknown'}`);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        logger.error(`[PRODUCTS_DELETE] Error: ${error}`);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


