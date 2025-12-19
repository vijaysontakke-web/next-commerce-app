"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RefreshCcw, Truck } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

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

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(savedOrders);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();

    // Listen for storage events (if testing in multiple tabs)
    window.addEventListener("storage", loadOrders);
    return () => window.removeEventListener("storage", loadOrders);
  }, []);

  const updateStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        const now = new Date().toISOString();
        return {
          ...order,
          status: newStatus,
          statusDates: {
            ...order.statusDates,
            [newStatus]: now,
          },
        };
      }
      return order;
    });

    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
  };

  return (
    <div className="container py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage orders and shipping.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/products">
            <Button variant="outline" size="sm" className="gap-2">
              Manage Products
            </Button>
          </Link>
          <Link href="/admin/categories">
            <Button variant="outline" size="sm" className="gap-2">
              Manage Categories
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={loadOrders}
            className="gap-2"
          >
            <RefreshCcw className="h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Simple Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "INR",
                }).format(orders.reduce((acc, curr) => acc + curr.total, 0))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Shipments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter((o) => o.status === "Processing").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>View and manage latest orders.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono">{order.id}</TableCell>
                      <TableCell>
                        {new Date(order.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === "Delivered"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "INR",
                        }).format(order.total)}
                      </TableCell>
                      <TableCell className="text-right">
                        {order.status === "Processing" && (
                          <Button
                            size="sm"
                            onClick={() => updateStatus(order.id, "Shipped")}
                            className="gap-2"
                          >
                            <Truck className="h-4 w-4" /> Ship Order
                          </Button>
                        )}
                        {order.status === "Shipped" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => updateStatus(order.id, "Delivered")}
                          >
                            Mark Delivered
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
