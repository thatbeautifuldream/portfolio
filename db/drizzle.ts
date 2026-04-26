import { loadEnvConfig } from "@next/env";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/lib/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

export const db = drizzle(env.DATABASE_URL);