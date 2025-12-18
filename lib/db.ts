import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'users.json');
const categoriesDbPath = path.join(process.cwd(), 'data', 'categories.json');
const productsDbPath = path.join(process.cwd(), 'data', 'products.json');

export interface User {
    id: string;
    name: string;
    email: string;
    password: string; // In a real app, this should be hashed!
    role: 'user' | 'admin';
    phone?: string;
    address?: {
        street?: string;
        city?: string;
        zip?: string;
        country?: string;
    };
}

export interface Category {
    id: string;
    name: string;
    description: string;
    slug: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    slug: string;
    price: number;
    currency: string;
    images: string[];
    categoryId: string;
    inventory: number;
    rating: number;
    reviewCount: number;
    features: string[];
}

function readDb(): User[] {
    try {
        const data = fs.readFileSync(dbPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function writeDb(users: User[]) {
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
}

function readCategoriesDb(): Category[] {
    try {
        const data = fs.readFileSync(categoriesDbPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function writeCategoriesDb(categories: Category[]) {
    fs.writeFileSync(categoriesDbPath, JSON.stringify(categories, null, 2));
}

function readProductsDb(): Product[] {
    try {
        const data = fs.readFileSync(productsDbPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function writeProductsDb(products: Product[]) {
    fs.writeFileSync(productsDbPath, JSON.stringify(products, null, 2));
}

export const db = {
    user: {
        findUnique: async ({ where }: { where: { email: string } }) => {
            const users = readDb();
            return users.find((user) => user.email === where.email) || null;
        },
        create: async ({ data }: { data: Omit<User, 'id'> }) => {
            const users = readDb();
            const newUser = { ...data, id: Math.random().toString(36).substring(2, 11) };
            users.push(newUser);
            writeDb(users);
            return newUser;
        },
        update: async ({ where, data }: { where: { email: string }, data: Partial<User> }) => {
            const users = readDb();
            const index = users.findIndex((u) => u.email === where.email);
            if (index === -1) throw new Error("User not found");

            const updatedUser = { ...users[index], ...data };
            users[index] = updatedUser;
            writeDb(users);
            return updatedUser;
        }
    },
    category: {
        findMany: async () => {
            return readCategoriesDb();
        },
        create: async ({ data }: { data: Omit<Category, 'id'> }) => {
            const categories = readCategoriesDb();
            const newCategory = { ...data, id: Math.random().toString(36).substring(2, 11) };
            categories.push(newCategory);
            writeCategoriesDb(categories);
            return newCategory;
        },
        update: async ({ where, data }: { where: { id: string }, data: Partial<Category> }) => {
            const categories = readCategoriesDb();
            const index = categories.findIndex((c) => c.id === where.id);
            if (index === -1) throw new Error("Category not found");

            const updatedCategory = { ...categories[index], ...data };
            categories[index] = updatedCategory;
            writeCategoriesDb(categories);
            return updatedCategory;
        },
        delete: async ({ where }: { where: { id: string } }) => {
            const categories = readCategoriesDb();
            const newCategories = categories.filter((c) => c.id !== where.id);
            writeCategoriesDb(newCategories);
            return { success: true };
        }
    },
    product: {
        findMany: async () => {
            return readProductsDb();
        },
        findUnique: async ({ where }: { where: { id?: string; slug?: string } }) => {
            const products = readProductsDb();
            if (where.id) return products.find(p => p.id === where.id) || null;
            if (where.slug) return products.find(p => p.slug === where.slug) || null;
            return null;
        },
        create: async ({ data }: { data: Omit<Product, 'id'> }) => {
            const products = readProductsDb();
            const newProduct = { ...data, id: Math.random().toString(36).substring(2, 11) };
            products.push(newProduct);
            writeProductsDb(products);
            return newProduct;
        },
        update: async ({ where, data }: { where: { id: string }, data: Partial<Product> }) => {
            const products = readProductsDb();
            const index = products.findIndex((p) => p.id === where.id);
            if (index === -1) throw new Error("Product not found");

            const updatedProduct = { ...products[index], ...data };
            products[index] = updatedProduct;
            writeProductsDb(products);
            return updatedProduct;
        },
        delete: async ({ where }: { where: { id: string } }) => {
            const products = readProductsDb();
            const newProducts = products.filter((p) => p.id !== where.id);
            writeProductsDb(newProducts);
            return { success: true };
        }
    }
};
