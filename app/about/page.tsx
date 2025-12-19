import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, ShieldCheck, Truck, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us | NextStore",
  description:
    "Learn more about NextStore, your premium destination for modern lifestyle products.",
};

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-16">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row gap-8 items-center mb-16">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Improving your lifestyle, <br className="hidden sm:inline" />
            <span className="text-primary">one product at a time.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            NextStore is a premier e-commerce destination built with the latest
            technologies to provide a seamless, fast, and secure shopping
            experience. We curate high-quality products that elevate your
            everyday life.
          </p>
          <div className="flex gap-4">
            <Link href="/products">
              <Button
                size="lg"
                className="rounded-full px-8 hover:bg-gray-200 hover:text-primary"
              >
                Shop Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 hover:bg-gray-200 hover:text-primary"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex-1 w-full max-w-md md:max-w-full">
          <div className="relative aspect-video md:aspect-square rounded-2xl overflow-hidden bg-muted">
            {/* Abstract decorative background or placeholder if no real image */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Image
                src="/images/next-commerce-about.avif"
                alt="About Us"
                fill
              />
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-12" />

      {/* Mission Section */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h2 className="text-3xl font-bold">Our Mission</h2>
        <p className="text-muted-foreground text-lg">
          To demonstrate the power of modern web development while providing a
          delightful shopping experience. We believe in quality code, quality
          designs, and quality products.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<Zap className="w-10 h-10 text-yellow-500" />}
          title="Lightning Fast"
          description="Powered by Next.js, our store offers instant page loads and smooth transitions."
        />
        <FeatureCard
          icon={<ShieldCheck className="w-10 h-10 text-green-500" />}
          title="Secure Payments"
          description="Your security is our priority. We use industry-standard encryption for all transactions."
        />
        <FeatureCard
          icon={<Truck className="w-10 h-10 text-blue-500" />}
          title="Global Shipping"
          description="We deliver to over 100 countries with real-time tracking and fast delivery options."
        />
      </div>

      {/* Stats Section */}
      <div className="bg-muted/30 rounded-3xl p-8 md:p-12 mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <StatItem value="10k+" label="Happy Customers" />
          <StatItem value="500+" label="Products" />
          <StatItem value="24/7" label="Support" />
          <StatItem value="100%" label="Satisfaction" />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="pt-6 text-center flex flex-col items-center gap-4">
        <div className="p-4 rounded-full bg-muted/50 mb-2">{icon}</div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="space-y-2">
      <div className="text-3xl md:text-4xl font-black text-primary">
        {value}
      </div>
      <div className="text-sm md:text-base text-muted-foreground uppercase tracking-wider font-semibold">
        {label}
      </div>
    </div>
  );
}
