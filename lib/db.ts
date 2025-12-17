import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'users.json');

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

export const db = {
    user: {
        findUnique: async ({ where }: { where: { email: string } }) => {
            const users = readDb();
            return users.find((user) => user.email === where.email) || null;
        },
        create: async ({ data }: { data: Omit<User, 'id'> }) => {
            const users = readDb();
            const newUser = { ...data, id: Math.random().toString(36).substr(2, 9) };
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
};
