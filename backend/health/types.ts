import { z } from "zod";

export const HealthCheckOutputSchema = z.object({
  status: z.literal("healthy"),
  timestamp: z.string(),
  uptime: z.number(),
  version: z.string().optional(),
  environment: z.string().optional(),
  services: z.object({
    database: z.enum(["healthy", "unhealthy"]),
    api: z.enum(["healthy", "unhealthy"]),
  }),
});

export const DetailedHealthCheckOutputSchema = z.object({
  status: z.literal("healthy"),
  timestamp: z.string(),
  uptime: z.number(),
  version: z.string().optional(),
  environment: z.string().optional(),
  services: z.object({
    database: z.object({
      status: z.enum(["healthy", "unhealthy"]),
      responseTime: z.number(),
      lastCheck: z.string(),
    }),
    api: z.object({
      status: z.enum(["healthy", "unhealthy"]),
      responseTime: z.number(),
      lastCheck: z.string(),
    }),
  }),
  system: z.object({
    memory: z.object({
      used: z.number(),
      total: z.number(),
      percentage: z.number(),
    }),
    nodejs: z.object({
      version: z.string(),
      pid: z.number(),
    }),
  }),
});

export type THealthCheck = z.infer<typeof HealthCheckOutputSchema>;
export type TDetailedHealthCheck = z.infer<typeof DetailedHealthCheckOutputSchema>;