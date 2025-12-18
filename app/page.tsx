import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/features/products/product-grid";
import { db } from "@/lib/db";
import { Product } from "@/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [dbProducts, dbCategories] = await Promise.all([
    db.product.findMany(),
    db.category.findMany(),
  ]);

  const products: Product[] = dbProducts.map((p) => {
    const category = dbCategories.find((c) => c.id === p.categoryId) || {
      id: "unknown",
      name: "Unknown",
      slug: "unknown",
      description: "",
    };
    return {
      ...p,
      category,
    };
  });

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col gap-12">
      {/* Hero Section */}
      <section className="relative bg-muted py-12 md:py-20">
        <div className="container flex flex-col items-center text-center gap-6">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Premium Quality, delivered.
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
            Explore our curated collection of electronics, fashion, and
            lifestyle products. Designed for modern living.
          </p>
          <div className="flex gap-4 mt-4">
            <Link href="/products">
              <Button size="lg" className="px-8 text-lg h-12">
                Shop Now
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="px-8 text-lg h-12">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Featured Products
          </h2>
          <Link
            href="/products"
            className="hidden md:block text-primary hover:underline font-medium"
          >
            View All Products
          </Link>
        </div>
        <ProductGrid products={featuredProducts} />
        <div className="mt-8 text-center md:hidden">
          <Link href="/products">
            <Button variant="outline" className="w-full">
              View All Products
            </Button>
          </Link>
        </div>
      </section>

      {/* Newsletter / CTA Section (Could be a separate component later) */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Join our Newsletter
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            Subscribe to get special offers, free giveaways, and
            once-in-a-lifetime deals.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto items-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background text-foreground"
            />
            <Button
              variant="secondary"
              className="w-full sm:w-auto font-semibold"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
