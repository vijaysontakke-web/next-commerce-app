"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, CreditCard, Truck } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  if (items.length === 0) {
    return null;
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create mock order
    const order = {
        id: Math.random().toString(36).substring(2, 9).toUpperCase(),
        date: new Date().toISOString(),
        items: items,
        total: cartTotal,
        status: "Processing"
    };

    // Save to local storage (mock backend)
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem("orders", JSON.stringify([order, ...existingOrders]));

    clearCart();
    setIsProcessing(false);
    toast.success("Order placed successfully! Redirecting...");
    router.push(`/orders/${order.id}?success=true`);
  };

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-8">
           <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">
              
              {/* Shipping Section */}
              <Card>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                       <Truck className="h-5 w-5" /> Shipping Address
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label htmlFor="firstName">First Name</Label>
                       <Input id="firstName" required placeholder="John" />
                    </div>
                     <div className="space-y-2">
                       <Label htmlFor="lastName">Last Name</Label>
                       <Input id="lastName" required placeholder="Doe" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <Label htmlFor="address">Address</Label>
                       <Input id="address" required placeholder="123 Main St" />
                    </div>
                    <div className="space-y-2">
                       <Label htmlFor="city">City</Label>
                       <Input id="city" required placeholder="New York" />
                    </div>
                     <div className="space-y-2">
                       <Label htmlFor="zip">Zip Code</Label>
                       <Input id="zip" required placeholder="10001" />
                    </div>
                 </CardContent>
              </Card>

              {/* Payment Section */}
              <Card>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                       <CreditCard className="h-5 w-5" /> Payment Method
                    </CardTitle>
                 </CardHeader>
                 <CardContent>
                    <RadioGroup defaultValue="card" className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <div>
                          <RadioGroupItem value="card" id="card" className="peer sr-only" />
                          <Label
                            htmlFor="card"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <CreditCard className="mb-3 h-6 w-6" />
                            Card
                          </Label>
                       </div>
                       {/* Add more payment options if needed */}
                    </RadioGroup>
                    
                    <div className="mt-6 grid gap-4">
                       <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <Label htmlFor="expiry">Expiry</Label>
                             <Input id="expiry" placeholder="MM/YY" />
                          </div>
                          <div className="space-y-2">
                             <Label htmlFor="cvc">CVC</Label>
                             <Input id="cvc" placeholder="123" />
                          </div>
                       </div>
                    </div>
                 </CardContent>
              </Card>
           </form>
        </div>

        {/* Order Summary Summary */}
        <div className="lg:col-span-4">
          <Card className="sticky top-24">
             <CardHeader>
                <CardTitle>Order Summary</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                 <div className="space-y-2">
                    {items.map(item => (
                       <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{item.quantity}x {item.name}</span>
                          <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: item.currency }).format(item.price * item.quantity)}</span>
                       </div>
                    ))}
                 </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                   <span>Total</span>
                   <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(cartTotal)}</span>
                </div>
             </CardContent>
             <CardFooter>
                  <Button 
                    type="submit" 
                    form="checkout-form"
                    size="lg" 
                    className="w-full font-bold" 
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : `Pay ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(cartTotal)}`}
                  </Button>
             </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
