//importing prisma database client
import { PrismaClient } from '@prisma/client'

//creating prisma object
export const db = new PrismaClient();

//exporting the prisma object as a database object
export default db