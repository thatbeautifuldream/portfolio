import { os } from "@orpc/server";
import { authed } from "@/backend/orpc";
import {
  checkDatabaseHealth,
  getEnvironment,
  getSystemInfo,
  getUptime,
  getVersion,
} from "./helpers";
import {
  DetailedHealthCheckOutputSchema,
  HealthCheckOutputSchema,
} from "./types";

export const healthCheck = os
  .output(HealthCheckOutputSchema)
  .handler(async () => {
    const dbHealth = await checkDatabaseHealth();

    return {
      status: "healthy" as const,
      timestamp: new Date().toISOString(),
      uptime: getUptime(),
      version: getVersion(),
      environment: getEnvironment(),
      services: {
        database: dbHealth.status,
        api: "healthy" as const,
      },
    };
  });

export const detailedHealthCheck = authed
  .output(DetailedHealthCheckOutputSchema)
  .handler(async () => {
    const dbHealth = await checkDatabaseHealth();
    const systemInfo = getSystemInfo();

    return {
      status: "healthy" as const,
      timestamp: new Date().toISOString(),
      uptime: getUptime(),
      version: getVersion(),
      environment: getEnvironment(),
      services: {
        database: dbHealth,
        api: {
          status: "healthy" as const,
          responseTime: 0,
          lastCheck: new Date().toISOString(),
        },
      },
      system: systemInfo,
    };
  });