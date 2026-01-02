import fs from 'fs';
import path from 'path';
import logger from './logger';

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
        logger.error(`Error reading users database: ${error}`);
        return [];
    }
}

function writeDb(users: User[]) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
    } catch (error) {
        logger.error(`Error writing to users database: ${error}`);
        throw error;
    }
}

function readCategoriesDb(): Category[] {
    try {
        const data = fs.readFileSync(categoriesDbPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        logger.error(`Error reading categories database: ${error}`);
        return [];
    }
}

function writeCategoriesDb(categories: Category[]) {
    try {
        fs.writeFileSync(categoriesDbPath, JSON.stringify(categories, null, 2));
    } catch (error) {
        logger.error(`Error writing to categories database: ${error}`);
        throw error;
    }
}

function readProductsDb(): Product[] {
    try {
        const data = fs.readFileSync(productsDbPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        logger.error(`Error reading products database: ${error}`);
        return [];
    }
}

function writeProductsDb(products: Product[]) {
    try {
        fs.writeFileSync(productsDbPath, JSON.stringify(products, null, 2));
    } catch (error) {
        logger.error(`Error writing to products database: ${error}`);
        throw error;
    }
}

export const db = {
    user: {
        findUnique: async ({ where }: { where: { email: string } }) => {
            const users = readDb();
            return users.find((user) => user.email === where.email) || null;
        },
        create: async ({ data }: { data: Omit<User, 'id'> }) => {
            try {
                const users = readDb();
                const newUser = { ...data, id: Math.random().toString(36).substring(2, 11) };
                users.push(newUser);
                writeDb(users);
                logger.info(`DB: Created user with email: ${newUser.email}`);
                return newUser;
            } catch (error) {
                logger.error(`DB: Failed to create user with email: ${data.email}. Error: ${error}`);
                throw error;
            }
        },
        update: async ({ where, data }: { where: { email: string }, data: Partial<User> }) => {
            try {
                const users = readDb();
                const index = users.findIndex((u) => u.email === where.email);
                if (index === -1) {
                    logger.warn(`DB: User not found for update: ${where.email}`);
                    throw new Error("User not found");
                }

                const updatedUser = { ...users[index], ...data };
                users[index] = updatedUser;
                writeDb(users);
                logger.info(`DB: Updated user with email: ${where.email}`);
                return updatedUser;
            } catch (error) {
                logger.error(`DB: Failed to update user with email: ${where.email}. Error: ${error}`);
                throw error;
            }
        }
    },
    category: {
        findMany: async () => {
            return readCategoriesDb();
        },
        create: async ({ data }: { data: Omit<Category, 'id'> }) => {
            try {
                const categories = readCategoriesDb();
                const newCategory = { ...data, id: Math.random().toString(36).substring(2, 11) };
                categories.push(newCategory);
                writeCategoriesDb(categories);
                logger.info(`DB: Created category: ${newCategory.name}`);
                return newCategory;
            } catch (error) {
                logger.error(`DB: Failed to create category: ${data.name}. Error: ${error}`);
                throw error;
            }
        },
        update: async ({ where, data }: { where: { id: string }, data: Partial<Category> }) => {
            try {
                const categories = readCategoriesDb();
                const index = categories.findIndex((c) => c.id === where.id);
                if (index === -1) {
                    logger.warn(`DB: Category not found for update: ${where.id}`);
                    throw new Error("Category not found");
                }

                const updatedCategory = { ...categories[index], ...data };
                categories[index] = updatedCategory;
                writeCategoriesDb(categories);
                logger.info(`DB: Updated category: ${where.id}`);
                return updatedCategory;
            } catch (error) {
                logger.error(`DB: Failed to update category: ${where.id}. Error: ${error}`);
                throw error;
            }
        },
        delete: async ({ where }: { where: { id: string } }) => {
            try {
                const categories = readCategoriesDb();
                const newCategories = categories.filter((c) => c.id !== where.id);
                writeCategoriesDb(newCategories);
                logger.info(`DB: Deleted category: ${where.id}`);
                return { success: true };
            } catch (error) {
                logger.error(`DB: Failed to delete category: ${where.id}. Error: ${error}`);
                throw error;
            }
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
            try {
                const products = readProductsDb();
                const newProduct = { ...data, id: Math.random().toString(36).substring(2, 11) };
                products.push(newProduct);
                writeProductsDb(products);
                logger.info(`DB: Created product: ${newProduct.name}`);
                return newProduct;
            } catch (error) {
                logger.error(`DB: Failed to create product: ${data.name}. Error: ${error}`);
                throw error;
            }
        },
        update: async ({ where, data }: { where: { id: string }, data: Partial<Product> }) => {
            try {
                const products = readProductsDb();
                const index = products.findIndex((p) => p.id === where.id);
                if (index === -1) {
                    logger.warn(`DB: Product not found for update: ${where.id}`);
                    throw new Error("Product not found");
                }

                const updatedProduct = { ...products[index], ...data };
                products[index] = updatedProduct;
                writeProductsDb(products);
                logger.info(`DB: Updated product: ${where.id}`);
                return updatedProduct;
            } catch (error) {
                logger.error(`DB: Failed to update product: ${where.id}. Error: ${error}`);
                throw error;
            }
        },
        delete: async ({ where }: { where: { id: string } }) => {
            try {
                const products = readProductsDb();
                const newProducts = products.filter((p) => p.id !== where.id);
                writeProductsDb(newProducts);
                logger.info(`DB: Deleted product: ${where.id}`);
                return { success: true };
            } catch (error) {
                logger.error(`DB: Failed to delete product: ${where.id}. Error: ${error}`);
                throw error;
            }
        },
        bulkCreate: async ({ data }: { data: Omit<Product, 'id'>[] }) => {
            try {
                const products = readProductsDb();
                const newProducts = data.map(item => ({
                    ...item,
                    id: Math.random().toString(36).substring(2, 11)
                }));
                const updatedProducts = [...products, ...newProducts];
                writeProductsDb(updatedProducts);
                logger.info(`DB: Bulk created ${newProducts.length} products`);
                return newProducts;
            } catch (error) {
                logger.error(`DB: Failed bulk creation of products. Error: ${error}`);
                throw error;
            }
        }
    }
};

