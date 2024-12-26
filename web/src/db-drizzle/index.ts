import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { NewUser, users } from "./schema";
import * as schema from "./schema";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});
export const db = drizzle(pool, { schema });

export const insertUser = async (user: NewUser) => {
  const [newUser] = await db
    .insert(users)
    .values({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    })
    .returning();

  return newUser;
};
