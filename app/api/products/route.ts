import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const products = await db.product.findMany();

        // Optionally join categories if needed, but for simple admin management list, basic data is fine.
        // Or if we want to filter by category slug via searchParams
        // const { searchParams } = new URL(req.url);
        // const slug = searchParams.get("category");

        return NextResponse.json(products);
    } catch (error) {
        console.error("[PRODUCTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || (session.user as any)?.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const body = await req.json();
        const { name, slug, description, price, categoryId, inventory, images, features } = body;

        if (!name || !slug || !price) {
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

        return NextResponse.json(product);
    } catch (error) {
        console.error("[PRODUCTS_POST]", error);
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

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error("[PRODUCTS_PUT]", error);
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
            return new NextResponse("Product ID required", { status: 400 });
        }

        await db.product.delete({
            where: { id }
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[PRODUCTS_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
