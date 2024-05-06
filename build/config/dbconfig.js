"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
//importing prisma database client
const client_1 = require("@prisma/client");
//creating prisma object
exports.db = new client_1.PrismaClient();
//exporting the prisma object as a database object
exports.default = exports.db;
