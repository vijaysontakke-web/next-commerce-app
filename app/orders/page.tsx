"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PackageSearch } from "lucide-react";

interface Order {
  id: string;
  date: string;
  items: any[];
  total: number;
  status: string;
  statusDates?: {
    [key: string]: string;
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(savedOrders);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="container py-24 text-center">Loading...</div>;
  }

  return (
    <div className="container py-8 md:py-12 animate-in fade-in duration-400">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Order History</h1>
      <p className="text-muted-foreground mb-8">
        View your past orders and status.
      </p>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/20">
          <PackageSearch className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No orders found</h3>
          <p className="text-muted-foreground mb-6">
            You haven't placed any orders yet.
          </p>
          <Link href="/products">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="hover:bg-muted/10 hover:shadow-md transition-colors"
            >
              <CardHeader className="p-4 sm:p-6 pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <CardDescription>
                      {new Date(order.date).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "INR",
                      }).format(order.total)}
                    </span>
                    <Badge
                      variant={
                        order.status === "Delivered" ? "secondary" : "default"
                      }
                    >
                      {order.status}
                    </Badge>
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="text-sm text-muted-foreground mt-2">
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "item" : "items"}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
