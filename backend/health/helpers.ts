import { sql } from "drizzle-orm";
import { db } from "../../db/drizzle";

export async function checkDatabaseHealth(): Promise<{
  status: "healthy" | "unhealthy";
  responseTime: number;
  lastCheck: string;
}> {
  const startTime = Date.now();
  const lastCheck = new Date().toISOString();

  try {
    await db.execute(sql`SELECT 1`);

    const responseTime = Date.now() - startTime;

    return {
      status: "healthy",
      responseTime,
      lastCheck,
    };
  } catch {
    const responseTime = Date.now() - startTime;

    return {
      status: "unhealthy",
      responseTime,
      lastCheck,
    };
  }
}

export function getSystemInfo() {
  const memoryUsage = process.memoryUsage();

  return {
    memory: {
      used: memoryUsage.heapUsed,
      total: memoryUsage.heapTotal,
      percentage: Math.round(
        (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100
      ),
    },
    nodejs: {
      version: process.version,
      pid: process.pid,
    },
  };
}

export function getUptime(): number {
  return Math.floor(process.uptime());
}

export function getEnvironment(): string {
  return process.env.NODE_ENV || "development";
}

export function getVersion(): string {
  return process.env.npm_package_version || "1.0.0";
}