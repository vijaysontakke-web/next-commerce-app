import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-bold tracking-tight">
              NextStore
            </Link>
            <p className="mt-4 text-sm text-uted-foreground text-gray-500">
              Premium e-commerce experience built with Next.js and Shadcn UI.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold">Shop</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li><Link href="/products" className="hover:text-primary">All Products</Link></li>
              <li><Link href="/categories" className="hover:text-primary">Categories</Link></li>
              <li><Link href="/deals" className="hover:text-primary">Deals</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold">Support</h3>
             <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-primary">FAQs</Link></li>
              <li><Link href="/shipping" className="hover:text-primary">Shipping Info</Link></li>
            </ul>
          </div>
          
           <div>
            <h3 className="text-sm font-semibold">Legal</h3>
             <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} NextStore. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
