import { Product, Category } from "@/types";

export const categories: Category[] = [
    { id: "1", name: "Electronics", slug: "electronics" },
    { id: "2", name: "Clothing", slug: "clothing" },
    { id: "3", name: "Home & Garden", slug: "home-garden" },
    { id: "4", name: "Accessories", slug: "accessories" },
];

export const products: Product[] = [
    {
        id: "1",
        name: "Wireless Noise-Canceling Headphones",
        slug: "wireless-headphones",
        description: "Premium wireless headphones with active noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for travel and focus.",
        price: 24999,
        currency: "INR",
        images: [
            "/images/headphones-1.svg",
            "/images/headphones-2.svg" // We'll just define one real file for now, duplicate or let second fail gracefully/fallback placeholder
        ],
        category: categories[0],
        inventory: 50,
        rating: 4.8,
        reviewCount: 124,
        features: ["Active Noise Cancellation", "30-hour Battery", "Bluetooth 5.0"]
    },
    {
        id: "2",
        name: "Minimalist Cotton T-Shirt",
        slug: "cotton-t-shirt",
        description: "A high-quality, breathable cotton t-shirt for everyday wear. Features a relaxed fit and durable stitching.",
        price: 1999,
        currency: "INR",
        images: ["/images/tshirt-1.svg"],
        category: categories[1],
        inventory: 100,
        rating: 4.5,
        reviewCount: 89,
        features: ["100% Organic Cotton", "Pre-shrunk", "Unisex Fit"]
    },
    {
        id: "3",
        name: "Smart Watch Series 5",
        slug: "smart-watch",
        description: "Track your fitness, notifications, and health with the latest Smart Watch. Water-resistant and packed with sensors.",
        price: 32999,
        currency: "INR",
        images: ["/images/watch-1.svg"],
        category: categories[0],
        inventory: 30,
        rating: 4.9,
        reviewCount: 210,
        features: ["Heart Rate Monitor", "GPS", "Water Resistant"]
    },
    {
        id: "4",
        name: "Leather Weekend Bag",
        slug: "leather-bag",
        description: "Durable leather travel bag with spacious compartments. The perfect companion for short trips.",
        price: 14999,
        currency: "INR",
        images: ["/images/bag-1.svg"],
        category: categories[3],
        inventory: 25,
        rating: 4.6,
        reviewCount: 67,
        features: ["Genuine Leather", "Laptop Compartment", "Adjustable Strap"]
    },
    {
        id: "5",
        name: "Modern Ceramic Vase",
        slug: "ceramic-vase",
        description: "Elegant ceramic vase with a matte finish. Adds a touch of modern sophistication to any room.",
        price: 3999,
        currency: "INR",
        images: ["/images/vase-1.svg"],
        category: categories[2],
        inventory: 15,
        rating: 4.7,
        reviewCount: 45,
        features: ["Handcrafted", "Matte Finish", "10 inches tall"]
    },

];
