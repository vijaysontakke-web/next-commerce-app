import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCardActions } from "./product-card-actions";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-lg">
      <CardHeader className="p-0">
        <Link
          href={`/products/${product.slug}`}
          className="block relative aspect-square overflow-hidden bg-muted"
        >
          {/* In a real app, use next/image with the actual image path. 
               For this demo, we might need to handle the placeholder if image is missing. */}
          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
            {/* Fallback for now if image mocks aren't real files */}
            <span className="sr-only">{product.name}</span>
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {product.inventory < 10 && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              Low Stock
            </Badge>
          )}
        </Link>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="mb-2">
            {product.category.name}
          </Badge>
        </div>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <span className="text-xl font-bold">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: product.currency,
            }).format(product.price)}
          </span>
        </div>
        <ProductCardActions product={product} />
      </CardFooter>
    </Card>
  );
}
