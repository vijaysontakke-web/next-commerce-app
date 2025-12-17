"use client";

import { useState } from "react";
import { Product } from "@/types";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(product);
    
    // Simple visual feedback
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  return (
    <Button 
      size="lg" 
      className="w-full md:w-auto gap-2 text-lg px-8 transition-all"
      onClick={handleAddToCart}
      disabled={isAdding}
    >
      <ShoppingCart className="w-5 h-5" />
      {isAdding ? "Added!" : "Add to Cart"}
    </Button>
  );
}
