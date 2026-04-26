import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    IP_SALT: z.string().optional(),
    SPOTIFY_CLIENT_ID: z.string().min(1),
    SPOTIFY_CLIENT_SECRET: z.string().min(1),
    SPOTIFY_REFRESH_TOKEN: z.string().min(1),
    SERVER_URL: z
      .string()
      .min(1)
      .refine(
        (val) => !(val.startsWith("http://") || val.startsWith("https://")),
        {
          message:
            "SERVER_URL must not include protocol (http:// or https://). Provide only the domain (e.g., 'example.com' or 'localhost:3000')",
        }
      ),
    CLARITY_API_TOKEN: z.string().min(1).optional(),
    API_AUTH_TOKEN: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_CLARITY_ID: z.string().min(1),
    NEXT_PUBLIC_GA_ID: z.string().min(1),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    IP_SALT: process.env.IP_SALT,
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REFRESH_TOKEN: process.env.SPOTIFY_REFRESH_TOKEN,
    SERVER_URL: process.env.SERVER_URL,
    CLARITY_API_TOKEN: process.env.CLARITY_API_TOKEN,
    API_AUTH_TOKEN: process.env.API_AUTH_TOKEN,
    NEXT_PUBLIC_CLARITY_ID: process.env.NEXT_PUBLIC_CLARITY_ID,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  },
});