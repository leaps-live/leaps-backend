import { Pool } from "pg";
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

declare global {
  var prisma: PrismaClient;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production we'll have a single connection to the DB.
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
  prisma.$connect();
}

export { prisma };

export let pool: Pool;

export function initDB() {
  console.log("Initializing PostgreSQL database");
  pool = new Pool({
    user: "leaps",
    password: process.env.DATABASE_PASSWORD, // put this in env file
    database: "initial_leaps",
    host: process.env.DATABASE_HOST,
    port: 5432,
    ssl: { rejectUnauthorized: false },
  });
  pool
    .connect()
    .then(() => console.log("Connected to PostgreSQL database"))
    .catch((err) =>
      console.error("Error connecting to PostgreSQL database", err)
    );
}

export function getPool() {
  if (!pool) {
    initDB();
  }
  return pool;
}
