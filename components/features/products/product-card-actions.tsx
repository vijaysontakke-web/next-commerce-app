"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { Product } from "@/types";

export function ProductCardActions({ product }: { product: Product }) {
  const { addItem } = useCart();
  
  return (
    <Button 
      size="sm" 
      className="gap-2" 
      onClick={(e) => {
        e.preventDefault();
        addItem(product);
      }}
    >
      <ShoppingCart className="h-4 w-4" />
      Add
    </Button>
  );
}
