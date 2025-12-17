
"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Package, Truck, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Order {
  id: string;
  date: string;
  items: any[];
  total: number;
  status: string;
}

export default function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";

  useEffect(() => {
    // Mock fetching order from "backend" (local storage)
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const foundOrder = orders.find((o: Order) => o.id === id);
    
    setOrder(foundOrder || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="container py-24 text-center">Loading order details...</div>;
  }

  if (!order) {
    return (
        <div className="container py-24 text-center">
            <h1 className="text-2xl font-bold mb-4">Order not found</h1>
             <Link href="/">
              <Button>Return Home</Button>
            </Link>
        </div>
    );
  }

  return (
    <div className="container py-8 md:py-12 max-w-3xl">
      {isSuccess && (
        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg flex flex-col items-center text-center">
          <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
             <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-green-800">Order Confirmed!</h1>
          <p className="text-green-700 mt-2">
            Thank you for your purchase. Your order ID is <span className="font-mono font-bold">{order.id}</span>
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <Link href="/orders">
            <Button variant="ghost" className="gap-2 pl-0">
                <ArrowLeft className="h-4 w-4" /> Back to Orders
            </Button>
        </Link>
        <Badge variant={order.status === "Processing" ? "secondary" : "default"}>
            {order.status}
        </Badge>
      </div>

      <Card>
        <CardHeader>
           <CardTitle className="text-xl">Order Details</CardTitle>
           <p className="text-sm text-muted-foreground">Placed on {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}</p>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="space-y-4">
              {order.items.map((item: any) => (
                 <div key={item.id} className="flex justify-between items-center bg-muted/20 p-3 rounded-md">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-muted rounded overflow-hidden relative">
                             <Image 
                                src={item.images[0] || "/placeholder.svg"} 
                                alt={item.name}
                                fill
                                className="object-cover"
                             />
                        </div>
                        <div>
                           <p className="font-medium">{item.name}</p>
                           <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                    </div>
                    <p className="font-medium">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: item.currency }).format(item.price * item.quantity)}
                    </p>
                 </div>
              ))}
           </div>
           
           <Separator />
           
           <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(order.total)}</span>
           </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <MapPinIcon className="h-4 w-4" /> Shipping Address
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        John Doe<br />
                        123 Main St<br />
                        New York, 10001
                    </p>
                </div>
                 <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Truck className="h-4 w-4" /> Delivery Status
                    </h3>
                    <div className="space-y-6 mt-4 relative pl-4 border-l-2 border-muted">
                        {[
                            { label: "Order Placed", date: order.date, status: "placed" },
                            { label: "Processing", status: "Processing" },
                            { label: "Shipped", status: "Shipped" },
                            { label: "Delivered", status: "Delivered" }
                        ].map((step, index) => {
                            const stepOrder = ["placed", "Processing", "Shipped", "Delivered"];
                            const currentStatusIndex = stepOrder.indexOf(order.status === "placed" ? "placed" : order.status);
                             // "Order Placed" is always active or if it's the start
                            const isActive = index <= (currentStatusIndex === -1 ? 0 : currentStatusIndex);
                            // Highlight if it's the current or past step
                            // For simplicity in this mock:
                            // "Processing" -> index 0 (Placed), index 1 (Processing) are active
                            
                            // Let's make a simpler check:
                            const steps = ["Processing", "Shipped", "Delivered"];
                            const isCompleted = index === 0 || steps.indexOf(order.status) >= index - 1; 

                            return (
                                <div key={step.label} className={`relative ${isCompleted ? "opacity-100" : "opacity-30"}`}>
                                    <div className={`absolute -left-[21px] top-1 h-3 w-3 rounded-full ${isCompleted ? "bg-primary" : "bg-muted-foreground"}`} />
                                    <p className="text-sm font-medium">{step.label}</p>
                                    {index === 0 && (
                                        <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MapPinIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    )
}
