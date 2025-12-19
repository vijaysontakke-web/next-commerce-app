"use client";

import Link from "next/link";
import {
  ShoppingCart,
  LogIn,
  Menu,
  User,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  const { cartCount } = useCart();
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-primary">
              NextStore
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/products"
              className="transition-colors hover:text-primary hover:bg-accent px-3 py-2 rounded-md"
            >
              Products
            </Link>
            <Link
              href="/orders"
              className="transition-colors hover:text-primary hover:bg-accent px-3 py-2 rounded-md"
            >
              Orders
            </Link>
            <Link
              href="/about"
              className="transition-colors hover:text-primary hover:bg-accent px-3 py-2 rounded-md"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-primary hover:bg-accent px-3 py-2 rounded-md"
            >
              Contact
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-left">NextStore</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 py-8">
                  <Link
                    href="/"
                    className="text-lg font-semibold hover:text-primary px-2 py-1 rounded-md hover:bg-accent"
                  >
                    Home
                  </Link>
                  <Link
                    href="/products"
                    className="text-lg font-semibold hover:text-primary px-2 py-1 rounded-md hover:bg-accent"
                  >
                    Products
                  </Link>
                  <Link
                    href="/orders"
                    className="text-lg font-semibold hover:text-primary px-2 py-1 rounded-md hover:bg-accent"
                  >
                    Orders
                  </Link>
                  <Link
                    href="/about"
                    className="text-lg font-semibold hover:text-primary px-2 py-1 rounded-md hover:bg-accent"
                  >
                    About
                  </Link>
                  <Link
                    href="/contact"
                    className="text-lg font-semibold hover:text-primary px-2 py-1 rounded-md hover:bg-accent"
                  >
                    Contact
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {loading ? (
            <div className="h-9 w-9 bg-muted rounded-full animate-pulse" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="/avatars/01.png"
                      alt={session.user?.name || "User"}
                    />
                    <AvatarFallback>
                      {session.user?.name?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    <span>My Orders</span>
                  </Link>
                </DropdownMenuItem>
                {(session.user as any).role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="default" size="sm" className="hidden md:flex">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
              <Button variant="default" size="sm" className="flex md:hidden">
                <LogIn className="mr-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
