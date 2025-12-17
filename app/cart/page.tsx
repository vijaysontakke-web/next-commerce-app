"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function CartPage() {
  const { items, removeItem, updateQuantity, cartTotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container py-24 flex flex-col items-center justify-center text-center">
        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
          <Trash2 className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link href="/products">
          <Button size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-8">
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative aspect-square sm:w-40 sm:h-40 bg-muted">
                     {/* Fallback image logic */}
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                         <Image 
                             src={item.images[0] || "/placeholder.svg"} 
                             alt={item.name} 
                             fill 
                             className="object-cover" 
                         />
                    </div>
                  </div>
                  
                  <div className="flex-1 p-4 sm:p-6 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                       <div>
                         <h3 className="font-semibold text-lg">{item.name}</h3>
                         <p className="text-sm text-muted-foreground">{item.category.name}</p>
                       </div>
                       <p className="font-bold text-lg">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: item.currency }).format(item.price)}
                       </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                       <div className="flex items-center border rounded-md">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-none"
                             onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                       </div>
                       
                       <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                          onClick={() => removeItem(item.id)}
                        >
                         <Trash2 className="h-4 w-4 mr-2" />
                         Remove
                       </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 flex justify-end">
             <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <Card className="sticky top-24">
             <CardHeader>
                <CardTitle>Order Summary</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Subtotal</span>
                   <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(cartTotal)}</span>
                </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Shipping</span>
                   <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Tax</span>
                   <span>₹0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                   <span>Total</span>
                   <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(cartTotal)}</span>
                </div>
             </CardContent>
             <CardFooter>
                <Link href="/checkout" className="w-full">
                  <Button size="lg" className="w-full font-bold">
                    Checkout <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
             </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
