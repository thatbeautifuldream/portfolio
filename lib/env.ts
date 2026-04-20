import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    CLARITY_API_TOKEN: z.string().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_CLARITY_ID: z.string().min(1),
    NEXT_PUBLIC_GA_ID: z.string().min(1),
  },
  runtimeEnv: {
    CLARITY_API_TOKEN: process.env.CLARITY_API_TOKEN,
    NEXT_PUBLIC_CLARITY_ID: process.env.NEXT_PUBLIC_CLARITY_ID,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  },
});