// import { PrismaClient } from "@prisma/client";

import { PrismaClient } from "@prisma/client";

console.log('Initializing Prisma client...');
const prisma = new PrismaClient({
    log: ["error", "query"], // Logs errors and queries for debugging purposes
});
console.log('Prisma client initialized successfully.');

export default prisma;
