import { ProductGrid } from "@/components/features/products/product-grid";
import { products } from "@/lib/data";

export default function ProductsPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
           <p className="text-muted-foreground mt-2">
            Browse our collection of premium items.
           </p>
        </div>
        
        {/* Placeholder for future filters/sorting */}
        <div className="flex gap-2">
            {/* Filter buttons could go here */}
        </div>
      </div>
      
      <ProductGrid products={products} />
    </div>
  );
}
