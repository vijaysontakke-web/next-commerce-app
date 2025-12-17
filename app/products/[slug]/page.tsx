import { notFound } from "next/navigation";
import Image from "next/image";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Star, Truck, ShieldCheck } from "lucide-react";
import { AddToCartButton } from "@/components/features/products/add-to-cart-button";
import { Product } from "@/types";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const products = await db.product.findMany();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  const [dbProduct, dbCategories] = await Promise.all([
      db.product.findUnique({ where: { slug } }),
      db.category.findMany()
  ]);

  if (!dbProduct) {
    notFound();
  }

  const category = dbCategories.find(c => c.id === dbProduct.categoryId) || { id: "unknown", name: "Unknown", slug: "unknown", description: "" };
  
  const product: Product = {
      ...dbProduct,
      category
  };

  if (!product) {
    notFound();
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images Gallery (Simple Mock) */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
             <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
               {/* Fallback/Mock Image */}
               <Image
                 src={product.images[0] || "/placeholder.svg"}
                 alt={product.name}
                 fill
                 className="object-cover"
                 priority
               />
             </div>
          </div>
          <div className="flex gap-4 overflow-auto pb-2">
            {product.images.map((img, idx) => (
              <div key={idx} className="relative aspect-square w-24 flex-none overflow-hidden rounded-md border bg-muted cursor-pointer hover:ring-2 hover:ring-primary">
                 <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
               <Badge variant="secondary" className="text-sm">
                {product.category.name}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span className="font-medium text-foreground">{product.rating}</span>
                <span>({product.reviewCount} reviews)</span>
              </div>
            </div>
           
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
             <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: product.currency }).format(product.price)}
              </span>
            </div>
          </div>
          
          <Separator />
          
          <div className="prose prose-sm text-muted-foreground">
            <p>{product.description}</p>
          </div>

          <div>
             <h3 className="text-sm font-medium mb-3">Highlights</h3>
             <ul className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                {product.features?.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {feature}
                    </li>
                ))}
             </ul>
          </div>

          <div className="flex flex-col gap-4 mt-auto">
             <div className="flex gap-4">
                 <AddToCartButton product={product} />
                 <Button size="lg" variant="outline" className="p-3">
                    <Star className="w-5 h-5" />
                 </Button>
             </div>
             <p className="text-xs text-muted-foreground text-center md:text-left">
                Free shipping on orders over ₹1999. 30-day return policy.
             </p>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                  <Truck className="w-4 h-4" />
                  <span>Fast Delivery</span>
              </div>
               <div className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Secure Payment</span>
              </div>
          </div>

        </div>
      </div>
    </div>
  );
}
