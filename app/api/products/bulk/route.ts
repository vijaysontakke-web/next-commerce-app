import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const body = await req.json();
        const { products } = body;

        if (!Array.isArray(products) || products.length === 0) {
            return new NextResponse("Invalid products data", { status: 400 });
        }

        const categories = await db.category.findMany();
        
        const preparedProducts = products.map((item: any) => {
            // Find category by name (case-insensitive)
            const category = categories.find(
                cat => cat.name.toLowerCase() === (item.category || "").toLowerCase()
            );

            return {
                name: item.name,
                slug: item.slug || item.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
                description: item.description || "",
                price: parseFloat(item.price) || 0,
                currency: "INR",
                categoryId: category ? category.id : "", // If not found, skip or handle (here we just put empty string)
                inventory: parseInt(item.inventory) || 0,
                images: item.image ? [item.image] : [],
                features: item.features ? item.features.split(";").map((f: string) => f.trim()) : [],
                rating: 0,
                reviewCount: 0
            };
        });

        // Filter out products without valid category if you want strictness, 
        // or just accept them. The user requested category management.
        const validProducts = preparedProducts.filter(p => p.categoryId !== "");
        
        if (validProducts.length === 0) {
            return new NextResponse("No products with valid categories found", { status: 400 });
        }

        const createdProducts = await (db.product as any).bulkCreate({ data: validProducts });

        return NextResponse.json({
            success: true,
            count: createdProducts.length,
            ignored: preparedProducts.length - validProducts.length
        });
    } catch (error) {
        console.error("[PRODUCTS_BULK_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
