export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    currency: string;
    images: string[];
    category: Category;
    inventory: number;
    rating: number;
    reviewCount: number;
    features?: string[];
}

export interface CartItem extends Product {
    quantity: number;
}
