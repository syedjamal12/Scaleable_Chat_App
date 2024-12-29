import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient({
    log: ["error", "query"],
})

export default prisma