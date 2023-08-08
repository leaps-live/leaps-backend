import { Pool } from "pg";
import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient()

export let pool: Pool;

export function initDB() {
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
